import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Gallery from './Gallery'
import 'bootstrap/dist/css/bootstrap.css'
//add <App/> back after testing
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
