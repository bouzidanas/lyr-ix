import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '../App.css'
import { Lyrix, ActionsHandle } from './Lyrix';
import { HiOutlinePlay, HiOutlinePause, HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2"
import { lyrics } from '../assets/the-awakening';

export type LyrixCardElement = {
  play: () => void;
  pause: () => void;
  load: () => void;
  isPlaying: () => boolean;
}

export interface LyrixCardProps {
  title?: string;
  lrc?: string;
  src?: string;
  height?: string;
  className?: string;
  theme?: "lyrix" | "inherit" | "spotify" | undefined;
  highlightColor?: string;
  start?: number;
  trailingSpace?: string;
  fadeStop?: string;
  scrollRatio?: number;
  mute?: boolean;
  disablePlayButton?: boolean;
  disableMuteButton?: boolean;
  lyricsScale?: number;
  controlsScale?: number;
  endingDelayBuffer?: number;
  onLineChange?: (line: number) => void;
  onPlay?: (time: number) => void;
  onPause?: () => void;
  onEnd?: () => void;
}

export const LyrixCard = forwardRef<LyrixCardElement, LyrixCardProps>(({ title='The Awakening - Onlap', lrc=lyrics, src='/ONLAP - The Awakening.mp3', height='62vh', className='', theme='lyrix', highlightColor='#ffffffbb', start=0, trailingSpace='0rem', fadeStop='0%', scrollRatio=1, lyricsScale=1, controlsScale=1, endingDelayBuffer=30000, mute=false, disablePlayButton=false, disableMuteButton=false, onLineChange=undefined, onPlay=undefined, onPause=undefined, onEnd=undefined }: LyrixCardProps, ref) => {
  const [usePlayIcon, setUsePlayIcon] = useState(true);
  const [muted, setMuted] = useState(mute);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyrixRef = useRef<ActionsHandle>(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      lyrixRef.current?.play();
    },
    pause: () => {
      lyrixRef.current?.pause();
    },
    load: () => {
      audioRef.current?.load();
    },
    isPlaying: () => {
      return lyrixRef.current?.isPlaying() ?? false;
    }
  }));

  const handleOnUserLineChange = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
  }
  
  const handleOnPause = () => {
    audioRef.current?.pause();
    setUsePlayIcon(true);
    onPause ? onPause() : null;
  }
  
  const handleOnPlay = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
    audioRef.current?.play();
    setUsePlayIcon(false);
    onPlay ? onPlay(time) : null;
  }

  const handleOnEnd = () => {
    lyrixRef.current ? lyrixRef.current.pause() : handleOnPause();
    onEnd ? onEnd() : null;
  }


  const togglePlay = () => {
    if (lyrixRef.current && lyrixRef.current.isPlaying()) {
      lyrixRef.current.pause();
    } else {
      lyrixRef.current?.play();
    }
  }

  return (
      <div className={'flex flex-col justify-center items-center gap-12 max-w-xl h-full px-6 py-10 sm:h-fit sm:px-12 sm:py-12 bg-black/5 rounded-2xl shadow-xl ' + className}>
        <Lyrix 
          ref={lyrixRef}
          key={0}
          className=' max-w-full flex-1 sm:flex-none'
          lyrics={lrc} 
          height={height}
          start={start} 
          highlightColor={highlightColor}
          fadeStop={fadeStop}
          readScrollRatio={scrollRatio}
          scale={lyricsScale}
          theme={theme}
          trailingSpace={trailingSpace}
          delayEnd={endingDelayBuffer}
          onUserLineChange={handleOnUserLineChange}
          onLineChange={onLineChange}
          onPause={handleOnPause}
          onPlay={handleOnPlay}
        />
        <div className='flex flex-row justify-left items-center h-10 w-full gap-5 mb-[-0.7rem]' >
          <button onClick={() => togglePlay()} disabled={disablePlayButton} className='bg-transparent border-none outline-none focus:border-none focus:outline-none w-fit p-0 m-[-4px] mb-[-6px]'  style={{color: highlightColor, transform:'scaleX('+controlsScale+') scaleY('+controlsScale+')'}} >
            {usePlayIcon ? 
              <HiOutlinePlay size={32} /> : 
              <HiOutlinePause size={32} />
            }
          </button> 
          <span className='inline-flex h-full items-center flex-1 ' style={{color: highlightColor, fontSize: Math.round(controlsScale*150)/100 + "rem", lineHeight: "2rem"}}>
              {title}
          </span>
          <button onClick={() => setMuted(!muted)} disabled={disableMuteButton} className='bg-transparent border-none outline-none focus:border-none focus:outline-none w-fit p-0 mb-[-2px]' style={{color: highlightColor, transform:'scaleX('+controlsScale+') scaleY('+controlsScale+')', opacity: disableMuteButton ? 0.5 : 1}}>
            {muted ?
              <HiOutlineSpeakerXMark size={28} /> :
              <HiOutlineSpeakerWave size={28} />
            }
          </button>
        </div>
        <audio ref={audioRef} src={src} muted={muted} onEnded={handleOnEnd} />
      </div>
  )
});
