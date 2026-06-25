import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import ChatProvider from "./Context/ChatProvider.jsx"
import { ToastProvider } from './components/ui/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <ToastProvider>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </ToastProvider>
)
