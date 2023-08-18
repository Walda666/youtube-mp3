# Youtube -> mp3 

## Description
Download all songs from a YouTube playlist, rename files and change metadata tags (artist, title, track n° album name & album cover)


## Installation & use

In order to use this program you need to :
- Install [NodeJS](https://nodejs.org/fr) and [FFmpeg](https://ffmpeg.org/download.html)
- Create Google App and get API Key (or ask someone) [Tutorial here](https://blog.hubspot.com/website/how-to-get-youtube-api-key)
- Create a file `.env` with the following
```bash
youtubekey="YOUR_API_KEY"
ffmpegPath="YOUR_PATH"
```

- Install packages

```bash
npm install
```

Run the program
```bash
node index.js
```

- 1st step : The program asks you the playlist url and informations for tags. You can leave them blank if you just want to download songs.

- 2nd step : It downloads songs, add tags and renames files based on a small filter.

- 3rd step : The program gives you time to change the titles you are not satisfied of. After that, juste type anything and the program will exit, after updating the title tags.

- 4th step : You can get all mp3 files in the `out` folder

## Details
I use the package `youtube-mp3-downloader` to convert & download which takes 1mn/video. I'll try to find something faster.

Some songs don't download correctly. It don't stop the program

## Example : 
![My Remote Image](https://i.imgur.com/4MbSxm8.png)
![My Remote Image](https://i.imgur.com/ppxyQjd.png)
