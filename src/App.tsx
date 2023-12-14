import './App.css'
import Lyrics from './components/Lyrics';

function App() {
  const lyrics = `
  First got it when he was six, didn't know any tricks
Matter fact first time he got on it, he slipped
Landed on his hip and busted his lip
For a week he had to talk with a lisp like this
Now we can end the story right here
But shorty didn't quit, it was something in the air
Yeah, he said it was something so appealing
He couldn't fight the feeling, something about it
He knew he couldn't doubt it, couldn't understand it, brand it
Since the first kick flip he landed, uh
Labeled a misfit, a bandit (ka-kump, ka-kump, ka-kump)
His neighbors couldn't stand it
So he was banished to the park
Started in the morning, wouldn't stop 'til after dark
Yeah, when they said its getting late in here
So I'm sorry young man, there's no skating here
  `;

  return (
    <>
      <h1 className='mb-16 text-5xl'>Show Goes On - Lupe Fiasco</h1> 
      <Lyrics 
        className='max-w-2xl'
        trailingSpace='0rem'
        lyrics={lyrics} 
        height='480px'
        start={0} 
        highlightColor='#ffffffbb'
        fadeStop='0%'
        theme='spotify'
      />
    </>
  )
}

export default App
