import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { samples } from './sounds/samples.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App samples={samples} steps={16} />
  </React.StrictMode>,
)
