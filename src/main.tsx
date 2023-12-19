import React from 'react'
import ReactDOM from 'react-dom/client'
import LyricsCard from './components/LyricsCard.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LyricsCard 
      // highlightColor='#f6bd60'
    />
  </React.StrictMode>,
)
