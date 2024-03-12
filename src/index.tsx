import { createRoot } from 'react-dom/client'
import { AppConfig } from './AppConfig'
import '@vkontakte/vkui/dist/vkui.css'
import './assets/style/override.css'
import { bridgeInit } from './shared/api/vkbridge'

// Init VK Mini App
bridgeInit()

const container = document.getElementById('root')
const root = container && createRoot(container)
root && root.render(<AppConfig />)
