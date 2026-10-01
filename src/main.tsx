import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { I18nProvider } from './i18n'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><I18nProvider><App /><Toaster position="top-right" toastOptions={{duration:3000}} /></I18nProvider></React.StrictMode>,
)