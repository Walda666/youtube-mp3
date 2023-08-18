var YoutubeMp3Downloader = require("youtube-mp3-downloader")
const axios = require('axios')
const fs = require('fs');
const prompt = require('prompt-sync')();
const ffmetadata = require("ffmetadata");
require('dotenv').config();
//Config
const ytkey = process.env.youtubekey
const pathFfmpeg = process.env.ffmpegPath
ffmetadata.setFfmpegPath(pathFfmpeg);
let videosId = {}
let num = 1
let defaultImage = ""
let queueFinished = false

// Get all videos from playlist
const getPlayListItems = async playlistID => {
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
            part: 'id,snippet',
            maxResults: 50,
            playlistId: playlistID,
            key: ytkey
        }
    });
    return result.data;
};


async function main() {
    // Get infos from user prompt
    const playlist = prompt('Put the playlist URL | Entrez l\'url de la playlist : ');
    const playlistId = playlist.split("list=")[1]
    let data = await getPlayListItems(playlistId)
    defaultImage = data.items[0].snippet.thumbnails.standard.url
    data.items.forEach(element => {
        videosId[element.snippet.resourceId.videoId] = num
        num++
    });

    // Infos for metadata
    let singer = prompt('Put the name of the artist | Entrez le nom de l\'artiste : ');
    let album = prompt('Put the name of the album | Entrez le nom de l\'album) : ');
    let image = prompt(`Put album cover URL | Entrez la pochette de l\'album en URL (défault : ${defaultImage}) : `);
    image == "" ? image = defaultImage : image = image

    fs.mkdirSync(`out/${singer} - ${album}`)
    var YD = new YoutubeMp3Downloader({
        "ffmpegPath": pathFfmpeg,       // FFmpeg binary location
        "outputPath": `out/${singer} - ${album}`,    // Output file location (default: the home directory)
        "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
        "queueParallelism": 2,                  // Download parallelism (default: 1)
        "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
        "allowWebm": false                      // Enable download from WebM sources (default: false)
    });

    // Foreach video in playlist : Download + rename + set tags (artist, album, image, n°)
    for (let key in videosId) {
        YD.download(key)
    }

    YD.on("finished", function (err, data) {
        let path = data.file
        let completeFile = path.split("/")
        let file = completeFile[2]
        // Remove useless words (filter need to be improved)
        file = file.replaceAll("(", "")
        file = file.replaceAll(")", "")
        file = file.replaceAll("[", "")
        file = file.replaceAll("]", "")
        file = file.replaceAll("lyrics", "")
        file = file.replaceAll("Lyrics", "")
        file = file.replaceAll("Clip", "")
        file = file.replaceAll("clip", "")
        file = file.replaceAll("Official", "")
        file = file.replaceAll("official", "")
        file = file.replaceAll("VideoClip", "")
        file = file.replaceAll("videoclip", "")
        file = file.replaceAll("OfficialVideo", "")
        file = file.replaceAll("officialvideo", "")
        file = file.replaceAll("OfficialClip", "")
        file = file.replaceAll("officialclip", "")
        file = file.replaceAll("OfficialMusicVideo", "")
        file = file.replaceAll("officialmusicvideo", "")
        file = file.replaceAll("OfficialLyricsVideo", "")
        file = file.replaceAll("officiallyricsvideo", "")
        file = file.replaceAll("Officiel", "")
        file = file.replaceAll("officiel", "")
        file = file.replaceAll("Video", "")
        file = file.replaceAll("video", "")
        file = file.replaceAll("Music", "")
        file = file.replaceAll("music", "")
        file = file.replaceAll("Audio", "")
        file = file.replaceAll("audio", "")
        file = file.replaceAll("HD", "")
        file = file.replaceAll("hd", "")
        file = file.replaceAll("HQ", "")
        file = file.replaceAll("hq", "")
        file = file.replaceAll("4K", "")
        file = file.replaceAll("4k", "")
        file = file.replaceAll("1080p", "")
        file = file.replaceAll("720p", "")
        file = file.replaceAll("480p", "")
        file = file.replaceAll("360p", "")
        file = file.replaceAll("240p", "")
        file = file.replaceAll("144p", "")
        file = file.replaceAll("Copyright", "")
        file = file.replaceAll("  ", " ")

        // If author not in title
        if (!file.includes(singer)) {
            file = `${singer} - ${file}`
        }
        let newPath = `out/${completeFile[1]}/${file}`;
        // Rename file
        fs.rename(path, newPath, callback)

        // Change metadata
        let metadata = {
            artist: singer,
            album: album,
            track: videosId[data.videoId]
        };

        metadataOptions = {
            attachments: [image],
        };

        ffmetadata.write(newPath, metadata, metadataOptions, function (err) {
            if (err) console.error("Error writing metadata", err);
            if (queueFinished) {

                let finished = prompt('All files are downloaded. Change the titles you want and type anything to exit | Tous les fichiers ont été téléchargés, veuillez modifier les titres à la main au besoin et écrivez n\'importe quoi pour finir : ');
                if (finished) {
                    fs.readdirSync(`out/${singer} - ${album}`).forEach(file => {
                        let metadata = {
                            title: file.split(".mp3")[0].split(" - ")[1]
                        };
                        ffmetadata.write(`out/${singer} - ${album}/${file}`, metadata, function (err) {
                            if (err) console.error("Error writing metadata", err);
                        });
                    });
                    console.log("Terminé avec succès !")
                }
            }
        });
    });

    // When all videos are downloaded and edited -> ask user to update titles by himself
    YD.on("queueSize", function (queueSize) {
        if (queueSize == 0) {
            queueFinished = true
        }
    });

    YD.on("error", function (error) {
        console.log(error);
    });

    function callback(err) {
        if (err) throw err;
    }
}

main()


// TODO : print progress bar + add option to download only one song + add prompt in english