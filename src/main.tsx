import React from 'react'
import ReactDOM from 'react-dom/client'
import LyricsCard from './components/LyricsCard.tsx'
import './index.css'
// import { lyrics } from './assets/mural';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LyricsCard 
      // title='Mural - Lupe Fiasco'
      // src='/Mural.mp3'
      // lrc={lyrics}
      // highlightColor='#f6bd60'
    />
  </React.StrictMode>,
)
