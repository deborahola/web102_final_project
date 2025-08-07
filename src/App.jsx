import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    if (isHome && window.innerWidth > 600) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    
    return () => {
      document.body.classList.remove('no-scroll');
    }
  }, [isHome]);

  return (
    <div className={`app ${isHome ? 'home-page' : ''}`}>

      <Navbar />

      <div className="content">
        <Routes>
          {/* Home page (list posts) */}
          <Route path="/" element={<Home />} />

          {/* Create new post */}
          <Route path="/create" element={<CreatePost />} />

          {/* Post detail */}
          <Route path="/post/:id" element={<PostDetail />} />

          {/* Edit post */}
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </div>
        
    </div>
  )
}

export default App
