>[!WARNING]
>This component is still in development and is not yet ready for production use.

# Lyr-ix

A component for displaying synced song lyrics.

## Features

- Includes the base component called `<Lyrix>` and an example app component called `<LyrixCard>`.
- A copyright-free song (.mp3) and an LRC file (containing the lyrics and timestamps) for testing.
  
### `<Lyrix>` component
- Lyrics control media playback positions. If you trigger play on a line, the media will play from that line's timestamp (i.e beginning of line). This means that the component restricts navigation to fixed points in provided audio track.
- Special automatic page scrolling that keeps the current line visible during play.
- Keyboard shortcuts for controlling media playback and lyrics navigation. `Up`/`Down` arrows for scroll, `Enter`/`Shift`+`Enter` for page scroll, and `Space` for play/pause.
- Mouse scroll for scroll and click for play/pause. Clicking any line will highlight that line, pause media if playing, and move play position to beginning of line. Clicking the line again will play media from this new position.
- Two built-in themes: `lyr-ix` and `spotify`. `lyr-ix` is the default theme. `spotify` is a theme that mimics the Spotify lyrics aesthetic.
- Option to provide your own CSS to customize the look and feel of the component. Also includes a `className` prop for adding tailwindCSS classes or your own classes.
- Event callbacks for `onPlay`, `onPause`, `onLineChange`, and `onUserLineChange`.
- Exposed functions `isPlaying`, `play`, and `pause` for triggering media playback from outside the component like, for example, via a button in the parent app. This is also useful for syncing the component with a media player.
- Other configuration parameters allow for changing start position, setting highlight color, add spacing before and after lyrics, and more.

## Installation
This package is not yet published to npm. You can install it directly from GitHub using the following command:

```bash
npm install bouzidanas/lyr-ix 
```

The components in this package use tailwindCSS for styling. To get the components to appear properly, you need to have tailwind installed in the project where you will be using Lyr-ix components. See [tailwindCSS documentation](https://tailwindcss.com/docs/installation) for installation instructions. 

After installing tailwindCSS, you need to add the following string to the content array in your projects `tailwind.config.js` file:
```js
"./node_modules/lyr-ix/**/*.{js,ts,jsx,tsx}"
```
This will allow tailwind to scan the Lyr-ix components for classes that you can use in your project. Your `tailwind.config.js` file should look something like this:

```diff
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
+    "./node_modules/lyr-ix/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [] ,
}
```

## Usage

For usage see `<LyrixCard>` component in [`src/components/LyrixCard.js`](https://github.com/bouzidanas/lyr-ix/blob/master/src/components/LyrixCard.tsx) of this repo. It is a simple example of how to use the `<Lyrix>` component. Note that you will have to change the import statement in your project. For example, the import statement in `LyrixCard.tsx`:
```ts
import { Lyrix, ActionsHandle } from './Lyrix';
```
should change to:
```ts
import { Lyrix, ActionsHandle } from 'lyr-ix';
```

## Themes
### `lyr-ix` theme
![lyr-ix style](https://github.com/bouzidanas/lyr-ix/assets/25779130/a8064cf3-ce29-475b-b3fc-69094b260023)
### `spotify` theme
![spotify style](https://github.com/bouzidanas/lyr-ix/assets/25779130/26386213-0193-4813-b6a3-3e1d3176375b)

## Demo

[![Static Badge](https://img.shields.io/badge/LyricsCard_Demo-415a77?style=for-the-badge)](https://lyr-ix.vercel.app/)

https://github.com/bouzidanas/lyr-ix/assets/25779130/cd581c47-f760-4ed3-a248-dd4cbe2699eb




## License

[![Static Badge](https://img.shields.io/badge/License-MIT-415a77?style=for-the-badge)](https://github.com/bouzidanas/lyr-ix/blob/master/LICENSE)
