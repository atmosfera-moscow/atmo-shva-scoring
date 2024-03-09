import { createRoot } from 'react-dom/client'
import App from './App'
import './assets/style/override.css'
import { bridgeInit } from './shared/api/vkbridge'

// Init VK  Mini App
bridgeInit()

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)