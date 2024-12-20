/** @jsxImportSource @emotion/react */
import { css as CSS, Global } from '@emotion/react'
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import type { CSSObject } from '@emotion/react';
import { useTimer } from 'react-use-precision-timer';
import { v4 as uuidv4 } from 'uuid';
import { lrcTimestampRegex, processLrcLyrics } from '../util/processLRC';

const googleFonts = `@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap');`

export type ActionsHandle = {
  play: () => void;
  pause: () => void;
  isPlaying: () => boolean;
}

export interface LyrixProps {
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
  scale?: number;
  delayEnd?: number;
  disableInteractivity?: boolean;
  onPlay?: (time: number) => void;
  onPause?: () => void;
  onUserLineChange?: (line: number, time: number) => void;
  onLineChange?: (line: number, time: number) => void;
}

export const Lyrix = forwardRef<ActionsHandle, LyrixProps>(({ lyrics, className = "", css = {}, start = 0, highlightColor = "#ffffffbb", height = "", fadeStop = "10ex", trailingSpace = "10rem", timestamps = undefined, readScrollRatio = 1, scale = 1, theme = "inherit", delayEnd = 10000, disableInteractivity = false, onPause = undefined, onPlay = undefined, onUserLineChange = undefined, onLineChange = undefined }: LyrixProps, ref) => {
  const [lyricsArray] = useState<string[]>(lrcTimestampRegex.test(lyrics) ? processLrcLyrics(lyrics).processedLines : lyrics.split("\n"));
  const [currentLine, setCurrentLine] = useState<number>(start);
  const lId = useRef<string>("lyr-ix-" + uuidv4().substring(0, 8));
  // const callbackAfterRender = useRef<number>(0);

  // If timestamps are not provided, look for them in the lyrics (lrc format)
  const timeStamps = timestamps ?? lrcTimestampRegex.test(lyrics) ? processLrcLyrics(lyrics).timestamps : undefined;
  
  // Calculate time deltas ie. time between highlighting each line of the lyrics
  const timeDeltas = timeStamps?.map((timestamp, index) => index + 1 < timeStamps.length? (timeStamps[index + 1] - timestamp) * 1000 : delayEnd);
  
  // Callback function for the timer to call at the end of the delay
  const callback = React.useCallback(() => setCurrentLine(currentLine => currentLine < lyricsArray.length - 1 ? currentLine + 1 : currentLine), [lyricsArray.length]);
    
  // Create the timer
  const timerRef = useRef(useTimer({ delay: timeDeltas}, callback));
  
  const startTimer = useCallback(() => {
    timerRef.current.start(undefined, currentLine);
  }, [currentLine]);
  
  const pauseTimer = () => {
    timerRef.current.stop();
  }

  // Expose the timer's play and pause methods to the parent component
  // -------------------------------------------------------------------
  // I dont know how expensive setting the ref is, but if it is expensive
  // note that the ref needs to be updated only when currentLine changes.
  // The current assumption is that setting the ref is not expensive so
  // the ref is set every render.
  useImperativeHandle(ref, () => ({
    play: () => {
      startTimer();
      if (onPlay && timeStamps && timeStamps.length > currentLine) onPlay(timeStamps[currentLine]);
    },
    pause: () => {
      pauseTimer();
      if (onPause) onPause();
    },
    isPlaying: () => timerRef.current.isRunning(),
  }));
  
  // Create a keydown event listener to pause/play the timer 
  // (and handle cleanup when the component unmounts)
  useEffect(() => {
    if (disableInteractivity) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (timerRef.current.isRunning()) {
          pauseTimer();
          if (onPause) onPause();
        } else {
          startTimer();
          if (onPlay && timeStamps && timeStamps.length > currentLine) onPlay(timeStamps[currentLine]);
        }
      }
      else if (e.shiftKey && e.key === "Enter") {
        const lyricsElement = document.getElementById(lId.current);
        if (e.repeat) {
          lyricsElement?.scrollTo({ top: lyricsElement.scrollTop - lyricsElement.getBoundingClientRect().height, behavior: "smooth" });
        } else {
          lyricsElement?.scrollTo({ top: lyricsElement.scrollTop - lyricsElement.getBoundingClientRect().height, behavior: "smooth" });
        }
      }
      else if (e.key === "Enter") {
        const lyricsElement = document.getElementById(lId.current);
        lyricsElement?.scrollTo({ top: lyricsElement.scrollTop + lyricsElement.getBoundingClientRect().height, behavior: "smooth" });
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
  }, [currentLine, timeStamps, onPause, onPlay, startTimer, disableInteractivity]);
  
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
  
  // // Warning: Callbacks functions should not be executed during this component's render phase
  // // because they may cause parent component to re-render at the same time which is
  // // known to be a source of problems. 
  // // The following useEffect is used to execute pending `onPlay`and `onPause`callbacks after render.
  // // This is necessary for when the timer is started or paused inside the render phase, ie where the 
  // // callbacks should not be directly called from.
  // useEffect(() => {
  //   if (callbackAfterRender.current > 0) {
  //     if (callbackAfterRender.current === 1) {
  //       callbackAfterRender.current = 0;
  //       if (onPlay && timeStamps && timeStamps.length > currentLine) onPlay(timeStamps[currentLine]);
  //     } else if (callbackAfterRender.current === 2) {
  //       callbackAfterRender.current = 0;
  //       if (onPause) onPause();
  //     }
  //   }
  // });
  
  // Execute the onLineChange callback when `currentLine` changes after render using useEffect.
  // Warning: Callbacks functions should not be executed during this component's render phase
  // because they may cause parent component to re-render at the same time which is
  // known to be a source of problems.
  useEffect(() => {
    onLineChange && onLineChange(currentLine, timeStamps && timeStamps.length > currentLine ? timeStamps[currentLine] : -1);
  }, [currentLine]);
  
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
${disableInteractivity ? "" : `& div.line:hover {
  color: ${highlightColor};
  filter: none;
}
`}
&::-webkit-scrollbar {
  display: none;
}
${theme === "spotify" ? `& div.line {
  font-family: 'Heebo', sans-serif;
  font-size: ${Math.round(scale*20)/10}rem;
  font-weight: 700;
  line-height: ${Math.round(scale*24)/10}rem;
  letter-spacing: -.01em;
  color: #000000a2;
  text-align: left;
  padding-top: ${scale}rem;
  padding-bottom: ${scale}rem;
}` : (theme === "lyrix" ? `& div.line {
  font-family: 'Roboto', sans-serif;
  font-size: ${Math.round(scale*20)/10}rem;
  font-weight: 700;
  line-height: ${Math.round(scale*24)/10}rem;
  letter-spacing: -.01em;
  color: #ffffff;
  text-align: left;
  padding-top: ${scale}rem;
  padding-bottom: ${scale}rem;
  opacity: 0.2;
  filter: blur(1px);
}` : "")}
${css}` : { display: "flex", flexDirection: "column", height: height, overflowY: "scroll", msOverflowStyle: "none", scrollbarWidth: "none", WebkitMaskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0))`, maskImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) ${fadeStop}, rgba(0, 0, 0, 1) calc(100% - ${fadeStop}), rgba(0, 0, 0, 0))`, '& div.line.current': { color: highlightColor, filter: "none", opacity: "1" }, '& div.line:hover': disableInteractivity ? undefined : { color: highlightColor, filter: "none", opacity: "1" }, '&::-webkit-scrollbar': { display: "none" }, '& div.line': theme === 'spotify' ? { fontFamily: "'Heebo', sans-serif", fontSize: Math.round(scale*200)/100+"rem", fontWeight: "700", lineHeight: Math.round(scale*240)/100+"rem", letterSpacing: "-0.01em", color: "#000000a2", textAlign: "left", paddingTop: scale + "rem", paddingBottom: scale + "rem" } : (theme === "lyrix" ? { fontFamily: "'Roboto', sans-serif", fontSize: Math.round(scale*200)/100+"rem", fontWeight: "700", lineHeight: Math.round(scale*240)/100+"rem", letterSpacing: "-0.01em", color: "#ffffff", textAlign: "left", paddingTop: scale+"rem", paddingBottom: scale+"rem", opacity: "0.2", filter: "blur(1px)" } : {}), ...css } as CSSObject;

return (
  <div id={lId.current} className={"lyrics " + className} css={CSS(completeCSS)} >
      <Global styles={CSS(googleFonts)} />
      <div key="space-before" className="spacer" css={CSS({ minHeight: trailingSpace })}></div>
      {lyricsArray.map((line, index) => (
        <div
        key={index}
        className={"line " + (index === currentLine ? "current" : (index < currentLine ? "past" : "future"))}
        onClick={() => {
          if (disableInteractivity) return;
          if (currentLine === index) {
            if (timerRef.current.isRunning()) {
              pauseTimer();
              if (onPause) onPause();
              } else {
                startTimer();
                if (onPlay && timeStamps && timeStamps.length > index) onPlay(timeStamps[index]);
              }
            } else {
              pauseTimer();
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
});
