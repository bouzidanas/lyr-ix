import { useRef, useState } from 'react';
import '../App.css'
import Lyrics from './Lyrics';
import { HiOutlinePlay, HiOutlinePause } from "react-icons/hi2"
import { lyrics } from '../assets/the-awakening';

interface LyricCardProps {
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
}

const LyricsCard = ({ title='The Awakening - Onlap', lrc=lyrics, src='/ONLAP - The Awakening.mp3', height='670px', className='', theme='lyrix', highlightColor='#ffffffbb', start=0, trailingSpace='0rem', fadeStop='0%' }: LyricCardProps) => {
  const [action, setAction] = useState<"play" | "pause" | "none">('pause');
  const [usePlayIcon, setUsePlayIcon] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    if (action === 'none' || action === 'pause') {
      setAction('play');
    } else {
      setAction('pause');
    }
  }

  return (
    <>
      <div className={'flex flex-col justify-center items-center gap-12 max-w-xl p-12 bg-black/5 rounded-2xl shadow-xl' + className}>
        <Lyrics 
          key={0}
          className=' max-w-full'
          lyrics={lrc} 
          height={height}
          start={start} 
          highlightColor={highlightColor}
          fadeStop={fadeStop}
          theme={theme}
          trailingSpace={trailingSpace}
          onUserLineChange={handleOnUserLineChange}
          onPause={handleOnPause}
          onPlay={handleOnPlay}
          action={action}
        />
        <div className='flex flex-row justify-left items-center h-10 w-full gap-5 mb-[-0.7rem]' >
          <button onClick={() => togglePlay()} className='bg-transparent border-none outline-none focus:border-none focus:outline-none w-fit p-0 m-[-4px] mb-[-6px]' style={{color: highlightColor}} >
            {usePlayIcon ? 
              <HiOutlinePlay className='cursor-pointer' size={32} /> : 
              <HiOutlinePause className='cursor-pointer' size={32} />
            }
          </button> 
          <span className='inline-flex text-2xl h-full items-center' style={{color: highlightColor}}>
              {title}
          </span>
        </div>
      </div>
      <audio ref={audioRef} src={src} onEnded={() => handleOnPause()} />
    </>
  )
}

export default LyricsCard;
