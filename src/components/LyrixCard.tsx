import { useRef, useState } from 'react';
import '../App.css'
import { Lyrix, ActionsHandle } from './Lyrix';
import { HiOutlinePlay, HiOutlinePause } from "react-icons/hi2"
import { lyrics } from '../assets/the-awakening';

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
  mute?: boolean;
  disablePlayButton?: boolean;
  onLineChange?: (line: number) => void;
}

export const LyrixCard = ({ title='The Awakening - Onlap', lrc=lyrics, src='/ONLAP - The Awakening.mp3', height='62vh', className='', theme='lyrix', highlightColor='#ffffffbb', start=0, trailingSpace='0rem', fadeStop='0%', mute=false, disablePlayButton=false, onLineChange=undefined }: LyrixCardProps) => {
  const [usePlayIcon, setUsePlayIcon] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyrixRef = useRef<ActionsHandle>(null);

  const handleOnUserLineChange = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
  }
  
  const handleOnPause = () => {
    audioRef.current?.pause();
    setUsePlayIcon(true);
  }
  
  const handleOnPlay = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
    audioRef.current?.play();
    setUsePlayIcon(false);
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
          theme={theme}
          trailingSpace={trailingSpace}
          onUserLineChange={handleOnUserLineChange}
          onLineChange={onLineChange}
          onPause={handleOnPause}
          onPlay={handleOnPlay}
        />
        <div className='flex flex-row justify-left items-center h-10 w-full gap-5 mb-[-0.7rem]' >
          <button onClick={() => togglePlay()} disabled={disablePlayButton} className='bg-transparent border-none outline-none focus:border-none focus:outline-none w-fit p-0 m-[-4px] mb-[-6px]' style={{color: highlightColor}} >
            {usePlayIcon ? 
              <HiOutlinePlay size={32} /> : 
              <HiOutlinePause size={32} />
            }
          </button> 
          <span className='inline-flex text-2xl h-full items-center' style={{color: highlightColor}}>
              {title}
          </span>
        </div>
        <audio ref={audioRef} src={src} muted={mute} onEnded={() => handleOnPause()} />
      </div>
  )
}
