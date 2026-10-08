# AI Clip Maker

A modern local web app that accepts a YouTube URL, downloads a video you are authorized to process, finds candidate moments, and renders vertical clips with FFmpeg.

## Requirements

- Node.js 20+
- Internet access
- An OpenAI API key for AI-powered selection
- A YouTube video that you have permission to download/process
- `yt-dlp`/FFmpeg dependencies are managed by the Node packages where possible

## Run

```bash
npm install
cp .env.example .env
# Add OPENAI_API_KEY to .env
npm start
```

Open http://localhost:3000

## How it works

1. The browser posts a YouTube URL and clip settings to `/api/generate`.
2. The server validates the URL and downloads the source using `yt-dlp`.
3. The server extracts available subtitles/transcript text when possible.
4. The AI selects short highlight windows from the transcript.
5. FFmpeg renders 9:16 clips with burned-in captions where practical.
6. The browser polls `/api/jobs/:id` and displays the generated MP4 files.

## Important

Use this only for videos you own or are authorized to download and edit. The app does not bypass DRM or private access controls. You are responsible for complying with YouTube's terms, copyright law, and the rights of the people in the video.


## Easy start on Windows
1. Install Node.js 20+ from https://nodejs.org/
2. Extract the ZIP.
3. Open the `ai-clip-maker` folder and double-click `start-windows.bat`.
4. Add your `OPENAI_API_KEY` to `.env` when prompted.
5. Keep the terminal open and visit http://localhost:3000.

## Easy start on macOS / Linux
Run `chmod +x start-mac-linux.sh` then `./start-mac-linux.sh`.

## Online deployment
The included Dockerfile and Render manifest are starter deployment configuration.
Create a repository from these files, deploy it as a Docker web service, then add
`OPENAI_API_KEY` as a secret environment variable in the host dashboard. Never commit `.env`.
For production, add persistent storage and a background job queue; this starter keeps job
status in process memory.
