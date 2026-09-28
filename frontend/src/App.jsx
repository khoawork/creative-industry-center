import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

import './App.css'

import { Projects } from './pages/Projects' 

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="text-red-500">
      <Projects />
    </div>
  )
}

export default App
