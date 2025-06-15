import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Update document metadata
document.title = "QORE - The Core of Recruitment Excellence";

// Update meta description
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute(
    'content',
    'QORE is a smart-powered recruitment platform that streamlines your hiring process with intelligent resume parsing, precise candidate matching, and profit optimization.'
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
