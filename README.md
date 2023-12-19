>[!WARNING]
>This component is still in development and is not yet ready for production use.

# Lyr-ix

A component for displaying synced song lyrics.

## Features

- Includes the base component called `<Lyrics>` and an example app component called `<LyricsCard>`.
- A copyright-free song (.mp3) and an LRC file (containing the lyrics and timestamps) for testing.
  
### `<Lyrics>` component
- Lyrics control media playback positions. If you trigger play on a line, the media will play from that line's timestamp (i.e beginning of line).
- Keyboard shortcuts for controlling media playback and lyrics navigation. `Up`/`Down` arrows for scroll, `Spacebar` for page scroll, and `Enter` for play/pause.
- Mouse scroll for scroll and click for play/pause. Clicking any line will highlight that line and pause media if playing, and move play position to beginning of line. Clicking the line again will play media from this new position.
- Two built-in themes: `lyr-ix` and `spotify`. `lyr-ix` is the default theme. `spotify` is a theme that mimics the Spotify lyrics aesthetic.
- Option to provide your own CSS to customize the look and feel of the component. Also includes a `className` prop for adding your own classes or tailwindCSS classes.
- Event callbacks for `onPlay`, `onPause`, and `onUserLineChange`.
- `action` prop for triggering media playback from outside the component like, for example, via a button in the app. This is also useful for syncing the component with a media player.
- Other configuration parameters allow for changing start position, setting highlight color, add spacing before and after lyrics, and more.

`<LyricsCard>` component:

## Installation

```bash
npm install bouzidanas/lyr-ix 
```

## Usage

For usage see `<LyricsCard>` component in [`src/components/LyricsCard.js`](https://github.com/bouzidanas/lyr-ix/blob/master/src/components/LyricsCard.tsx) of this repo. It is a simple example of how to use the `<Lyrics>` component.

## Demo

[![Static Badge](https://img.shields.io/badge/Demo-415a77?style=for-the-badge)](https://lyr-ix.vercel.app/)

## License

[![Static Badge](https://img.shields.io/badge/License-MIT-415a77?style=for-the-badge)](https://github.com/bouzidanas/lyr-ix/blob/master/LICENSE)