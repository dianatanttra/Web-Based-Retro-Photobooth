# Photobooth

A browser-based photobooth web app built with React and TypeScript.

This app lets users capture 4 webcam photos in a classic vertical photo strip format, preview the strip, apply a filter, add custom text, and then download, print, or save the result in a browser-based album.

---

## Features

- Capture 4 photos using the device camera
- Automatic countdown before each shot
- Classic photo strip layout
- Color and black-and-white filter options
- Custom text caption
- Date added to the strip
- Export options:
  - Download as image
  - Print
  - QR code display
- Album/history view
- Local browser storage using IndexedDB

---

## Tech Stack

- React
- TypeScript
- Create React App
- Tailwind CSS
- IndexedDB via `idb`
- `qrcode.react`

---

## Project Structure

```text
photobooth/
├── public/
├── src/
│   ├── components/
│   │   ├── Album/
│   │   ├── Camera/
│   │   ├── Export/
│   │   ├── PhotoStrip/
│   │   └── UI/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```
