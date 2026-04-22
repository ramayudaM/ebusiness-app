import './bootstrap'
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { App } from './app/App'

const container = document.getElementById('root')
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
)
