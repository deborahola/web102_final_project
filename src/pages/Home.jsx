import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import dayjs from 'dayjs'

import { supabase } from '../utils/client'

import SearchSort from '../components/SearchSort'

import './styles/Home.css'


export default function Home() {
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('newest');


  useEffect(() => {
    fetchPosts()
  }, [])


  async function fetchPosts() {
    setLoading(true)

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error)
    } else {
      setPosts(data)
    }
    setLoading(false)
  }


  if (loading) {
    return <p className="loading">Loading posts...</p>
  } else if (posts.length === 0) {
    return <p className="no-posts">No posts yet. Be the first to share!</p>
  }


  const filtered = posts.filter((p) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = filtered.sort((a, b) => {
    switch (sortMode) {
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'most':
        return (b.upvotes || 0) - (a.upvotes || 0);
      case 'least':
        return (a.upvotes || 0) - (b.upvotes || 0);
      default: // newest
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });


  return (
    <div className="home-container">

      <aside className="home-sidebar">
        <SearchSort
          searchTerm={searchTerm}
          sortMode={sortMode}
          onChange={({ searchTerm, sortMode }) => {
            setSearchTerm(searchTerm)
            setSortMode(sortMode)
          }}
        />
        {/* future widgets go here */}
      </aside>

      <section className="home-feed">
        {sorted.length === 0 ? (
          <p className="no-sorted">No posts found.</p>
        ) : (
          sorted.map(post => (
            <Link 
              key={post.id} 
              to={`/post/${post.id}`} 
              className="post-card"
            >
              <h3>{post.title}</h3>
              <p>{dayjs(post.created_at).format('MMM D, YYYY h:mm A')}</p>
              <span>👍 &nbsp;<strong>{post.upvotes || 0}</strong> {post.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
            </Link>
          ))
        )}
      </section>

    </div>
  )
}
