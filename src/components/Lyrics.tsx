import React, { useEffect, useRef, useState } from 'react';
import { css as CSS, Global } from '@emotion/react'
import type { CSSObject } from '@emotion/react';
import { useTimer } from "react-use-precision-timer";
import { v4 as uuidv4 } from 'uuid';

const googleFonts = `@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');`

const lrcTimestampRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

// Convert LRC lyrics to timestamps and processed lines
const processLrcLyrics = (lyrics: string) => {
  const lines = lyrics.split("\n");
  const timestamps: number[] = [];
  const processedLines: string[] = [];

  lines.forEach(line => {
    const match = lrcTimestampRegex.exec(line);
    if (match) {
      timestamps.push((parseInt(match[1]) * 60 * 1000 + parseInt(match[2]) * 1000 + parseInt(match[3])*10) / 1000);
      processedLines.push(line.replace(lrcTimestampRegex, "").trim());
    }
  });

  return { timestamps, processedLines };
}

interface LyricsProps {
  lyrics: string;
  className?: string;
  css?: string | CSSObject;
  start?: number;
  highlightColor?: string;
  timestamps?: number[];
  height?: string;
  fade?: boolean;
  fadeStop?: string;
  trailingSpace?: string;
  readScrollRatio?: number;
  theme?: "inherit" | "spotify" | "lyrix";
  action?: "play" | "pause" | "none";
  onPlay?: (time: number) => void;
  onPause?: () => void;
  onUserLineChange?: (line: number, time: number) => void;
}

const Lyrics: React.FC<LyricsProps> = ({ lyrics, className = "", css = {}, start = 0, highlightColor = "#ffffffbb", height = "", fadeStop = "10ex", trailingSpace = "10rem", timestamps = undefined, readScrollRatio = 1, theme = "inherit", action = "none", onUserLineChange = undefined, onPause = undefined, onPlay = undefined }: LyricsProps) => {
  const [lyricsArray] = useState<string[]>(lrcTimestampRegex.test(lyrics) ? processLrcLyrics(lyrics).processedLines : lyrics.split("\n"));
  const [currentLine, setCurrentLine] = useState<number>(start);
  const lId = useRef<string>("lyr-ix-" + uuidv4().substring(0, 8));
  const delay = useRef<number>(1000);
  const lastAction = useRef<"play" | "pause" | "none">('none');
  const callbackAfterRender = useRef<number>(0);

  // If timestamps are not provided, look for them in the lyrics (lrc format)
  const timeStamps = timestamps ?? lrcTimestampRegex.test(lyrics) ? processLrcLyrics(lyrics).timestamps : undefined;

  // Calculate time deltas ie. time between highlighting each line of the lyrics
  const timeDeltas = timeStamps?.map((timestamp, index) => index + 1 < timeStamps.length? (timeStamps[index + 1] - timestamp) * 1000 : 1000);
  // Callback function for the timer to call at the end of the delay
  const callback = React.useCallback(() => setCurrentLine(currentLine => currentLine < lyricsArray.length - 1 ? currentLine + 1 : currentLine), [lyricsArray.length]);
  // Create the timer
  console.log(delay.current);
  const timer = useTimer({ delay: delay.current ?? 1000 }, callback);
  
  // The following line MUST come after the timer so that `timer` is defined and accessible.
  // Note that when the timer is running, the current delay is already being traversed,
  // so we need to set the delay to the next one (i.e currentLine + 1)
  delay.current = timeDeltas ? (timer.isRunning() ? (timeDeltas.length > currentLine + 1 ? timeDeltas[currentLine + 1] : 1000) : (timeDeltas.length > currentLine ? timeDeltas[currentLine] : 1000)) : 1000;
  // console.log(delay.current);


  // Create a keydown event listener to pause/play the timer 
  // (and handle cleanup when the component unmounts)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (timer.isRunning()) {
          timer.pause();
          if (onPause) onPause();
        } else {
          timer.start();
          if (onPlay && timeStamps && timeStamps.length > currentLine) onPlay(timeStamps[currentLine]);
        }
      }
      else if (e.shiftKey && e.key === "Enter") {
        const lyricsElement = document.getElementById(lId.current);
        if (e.repeat) {
          lyricsElement?.scrollTo({ top: lyricsElement.scrollTop - lyricsElement.getBoundingClientRect()?.height??200, behavior: "smooth" });
        } else {
          lyricsElement?.scrollTo({ top: lyricsElement.scrollTop - lyricsElement.getBoundingClientRect()?.height??200, behavior: "smooth" });
        }
      }
      else if (e.key === "Enter") {
        const lyricsElement = document.getElementById(lId.current);
        lyricsElement?.scrollTo({ top: lyricsElement.scrollTop + lyricsElement.getBoundingClientRect()?.height??200, behavior: "smooth" });
      }
      
      if (e.repeat) {
        if (e.key === "Enter"){
          const lyricsElement = document.getElementById(lId.current);
          if (e.shiftKey) {
            lyricsElement?.scrollTo({ top: lyricsElement.scrollTop-=200, behavior: "auto" });
          }
          else {
            lyricsElement?.scrollTo({ top: lyricsElement.scrollTop+=200, behavior: "auto" });
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [timer, currentLine, timeStamps, onPause, onPlay]);

  // Scrolling logic: Scroll to keep the current line in the
  // desired visible range.
  // -------------------------------------------------------------------
  // When the next line that is about to be highlighted exceeds
  // the readScrollRatio of the height of the lyrics element
  // the lyrics content must be scrolled down such that the current line
  // is at the (1-readScrollRatio) of the height of the lyrics element.
  useEffect(() => {
    const lyricsElement = document.getElementById(lId.current);
    const lineElements = document.getElementsByClassName("line");

    if (lyricsElement && lineElements.length > 0 && lineElements.length === lyricsArray.length && currentLine < lyricsArray.length - 1) {
      const lyricsClientRects = lyricsElement.getClientRects();
      const lineClientRects = lineElements[currentLine].getClientRects();
      const nextLineClientRects = lineElements[currentLine + 1].getClientRects();
      if (nextLineClientRects[0].bottom > (lyricsClientRects[0].top + readScrollRatio * lyricsClientRects[0].height)) {
        lyricsElement.scrollTo({ top: lyricsElement.scrollTop + (lineClientRects[0].top - lyricsClientRects[0].top) - (1.0 - readScrollRatio) * lyricsClientRects[0].height, behavior: "smooth" });
      }
      else if (lineClientRects[0].bottom < (lyricsClientRects[0].top + (1.0 - readScrollRatio) * lyricsClientRects[0].height)) {
        lyricsElement.scrollTo({ top: lyricsElement.scrollTop + (lineClientRects[0].top - lyricsClientRects[0].top) - (1.0 - readScrollRatio) * lyricsClientRects[0].height, behavior: "smooth" });
      }
    }
  }, [currentLine, lyricsArray.length, readScrollRatio]);

  if (action !== lastAction.current) {
    lastAction.current = action;
    if (action === "play") {
      timer.start();
      callbackAfterRender.current = 1
    }
    else if (action === "pause") {
      timer.pause();
      callbackAfterRender.current = 2
    }
  }

  useEffect(() => {
    if (callbackAfterRender.current > 0) {
      if (callbackAfterRender.current === 1) {
        callbackAfterRender.current = 0;
        if (onPlay && timeStamps && timeStamps.length > currentLine) onPlay(timeStamps[currentLine]);
      } else if (callbackAfterRender.current === 2) {
        callbackAfterRender.current = 0;
        if (onPause) onPause();
      }
    }
  });

  // Add default CSS in an overideable way
  const completeCSS = typeof css === "string" ? `display: flex;
flex-direction: column;
height: ${height};
overflow-y: scroll;
-ms-overflow-style: none;
scrollbar-width: none;
-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0));
mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0));
& div.line.current {
  color: ${highlightColor};
  filter: none;
}
& div.line:hover {
  color: ${highlightColor};
  filter: none;
}
&::-webkit-scrollbar {
    display: none;
}
${theme === "spotify" ? `& div.line {
  font-family: 'Heebo', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.4rem;
  letter-spacing: -.01em;
  color: #000000a2;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
}` : (theme === "lyrix" ? `& div.line {
  font-family: 'Roboto', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 2.4rem;
  letter-spacing: -.01em;
  color: #ffffff;
  text-align: left;
  padding-top: 1rem;
  padding-bottom: 1rem;
  opacity: 0.2;
  filter: blur(1px);
}` : "")}
${css}` : { display: "flex", flexDirection: "column", height: height, overflowY: "scroll", msOverflowStyle: "none", scrollbarWidth: "none", WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0))`, maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0))`, '& div.line.current': { color: highlightColor, filter: "none", opacity: "1" }, '& div.line:hover': { color: highlightColor, filter: "none", opacity: "1" }, '&::-webkit-scrollbar': { display: "none" }, '& div.line': theme === 'spotify' ? { fontFamily: "'Heebo', sans-serif", fontSize: "2rem", fontWeight: "700", lineHeight: "2.4rem", letterSpacing: "-0.01em", color: "#000000a2", textAlign: "left", paddingTop: "1rem", paddingBottom: "1rem" } : (theme === "lyrix" ? { fontFamily: "'Roboto', sans-serif", fontSize: "2rem", fontWeight: "700", lineHeight: "2.4rem", letterSpacing: "-0.01em", color: "#ffffff", textAlign: "left", paddingTop: "1rem", paddingBottom: "1rem", opacity: "0.2", filter: "blur(1px)" } : {}), ...css } as CSSObject;

  // console.log("render");

  return (
    <div id={lId.current} className={"lyrics " + className} css={CSS(completeCSS)} >
      <Global styles={CSS(googleFonts)} />
      <div key="space-before" className="spacer" css={CSS({ minHeight: trailingSpace })}></div>
      {lyricsArray.map((line, index) => (
        <div
          key={index}
          className={"line " + (index === currentLine ? "current" : "")}
          onClick={() => {
            if (currentLine === index) {
              if (timer.isRunning()) {
                timer.pause();
                if (onPause) onPause();
              } else {
                timer.start();
                if (onPlay && timeStamps && timeStamps.length > index) onPlay(timeStamps[index]);
              }
            } else {
              delay.current = timeDeltas ? (timeDeltas.length > index ? timeDeltas[index] : 1000) : 1000;
              timer.pause();
              if (onPause) onPause();
              setCurrentLine(index);
              if (onUserLineChange) onUserLineChange(index, timeStamps && timeStamps.length > index ? timeStamps[index] : -1);
            }
          }}
          dangerouslySetInnerHTML={{ __html: line.trim()}} 
        />
      ))}
      <div key="space-after" className="spacer" css={CSS({ minHeight: trailingSpace })}></div>
    </div>
  );
};

export default Lyrics;
