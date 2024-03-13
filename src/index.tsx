import { createRoot } from 'react-dom/client'
import { AppConfig } from './AppConfig'
import '@vkontakte/vkui/dist/vkui.css'
import './assets/style/override.css'
import bridge from '@vkontakte/vk-bridge'

// Init VK Mini App
bridge.send('VKWebAppInit')

const container = document.getElementById('root')
const root = container && createRoot(container)
root && root.render(<AppConfig />)
