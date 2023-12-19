import { useRef, useState } from 'react';
import './App.css'
import Lyrics from './components/Lyrics';
import { HiOutlinePlay, HiOutlinePause } from "react-icons/hi2"
import { lyrics } from './assets/put-you-on-game';

function App() {
  const [action, setAction] = useState<"play" | "pause" | "none">('pause');
  const [usePlayIcon, setUsePlayIcon] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleOnUserLineChange = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
  }
  
  const handleOnPause = () => {
    audioRef.current?.pause();
    console.log('paused');
    setUsePlayIcon(true);
  }
  
  const handleOnPlay = (time: number) => {
    audioRef.current? audioRef.current.currentTime = time : null;
    audioRef.current?.play();
    console.log('played');
    setUsePlayIcon(false);
  }

  const togglePlay = () => {
    console.log('toggle play: ' + audioRef.current?.paused);
    if (action === 'none' || action === 'pause') {
      console.log('right before play');
      setAction('play');
    } else {
      console.log('right before pause');
      setAction('pause');
    }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center gap-12 max-w-xl p-12 bg-black/5 rounded-2xl shadow-xl'>
        <Lyrics 
          key={0}
          className='max-w-2xl'
          lyrics={lyrics} 
          height='670px'
          start={0} 
          highlightColor='#ffffffbb'
          fadeStop='0%'
          theme='lyrix'
          trailingSpace='0rem'
          onUserLineChange={handleOnUserLineChange}
          onPause={handleOnPause}
          onPlay={handleOnPlay}
          action={action}
        />
        <div className='flex flex-row justify-left items-center h-10 w-full gap-4 mb-[-0.7rem]' >
          <button onClick={() => togglePlay()} className='bg-transparent border-none outline-none focus:border-none focus:outline-none w-fit p-0 m-[-4px]'>
            {usePlayIcon ? 
              <HiOutlinePlay className='cursor-pointer' size={32} /> : 
              <HiOutlinePause className='cursor-pointer' size={32} />
            }
          </button> 
          <span className='inline-flex text-xl h-full items-center'>
              Put You on Game - Lupe Fiasco
          </span>
        </div>
      </div>
      <audio ref={audioRef} src='/Put You on Game.mp3' />
    </>
  )
}

export default App
