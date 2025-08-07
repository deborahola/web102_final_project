import { Link } from 'react-router-dom'
import { useState } from 'react'

import { FaUtensils, FaBars, FaTimes } from 'react-icons/fa'

import './styles/Navbar.css'


export default function Navbar() {
  const [open, setOpen] = useState(false)


  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <FaUtensils /> Foodie Forum
      </div>

      <button
        className="menu-button"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        <Link to="/" onClick={() => setOpen(false)}>
          Home
        </Link>
        <Link to="/create" onClick={() => setOpen(false)}>
          Add Recipe
        </Link>
      </div>

    </nav>
  )
}
