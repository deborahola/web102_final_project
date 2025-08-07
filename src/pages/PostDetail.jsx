import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

import { supabase } from '../utils/client'
import { getCurrentUserId } from '../utils/auth'

import './styles/PostDetail.css'


export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [referencedPost, setReferencedPost] = useState(null)


  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (!error) {
      setPost(data)
      if (!data.reference_id) {
        setReferencedPost(null)
      } else {
        const { data: refData, error: refErr } = await supabase
          .from('posts')
          .select('id, title')
          .eq('id', data.reference_id)
          .single()
        if (!refErr) setReferencedPost(refData)
      }
    }
  }

  async function handleDelete() {
    if (window.confirm('Delete this post?')) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)
      if (!error) navigate('/')
      else console.error(error)
    }
  }


  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true })

    if (!error) setComments(data)
  }


  async function handleUpvote() {
    const updatedVotes = (post.upvotes || 0) + 1
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: updatedVotes })
      .eq('id', id)

    if (!error) setPost({ ...post, upvotes: updatedVotes })
  }


  async function handleAddComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return

    const currentUser = getCurrentUserId()
    const { data, error } = await supabase
      .from('comments')
      .insert([{ post_id: id, content: newComment, user_id: currentUser }])
      .select()

    if (!error && data.length > 0) {
      setComments([data[0], ...comments])
      setNewComment('')
    }
  }


  useEffect(() => {
    async function loadData() {
      await fetchPost()
      await fetchComments()
      setLoading(false)
    }
    loadData()
  }, [id])


  if (loading) return <p className="loading">Loading post...</p>
  if (!post) return <p className="error">Post not found</p>

  const currentUser = getCurrentUserId()


  return (
    <div className="post-detail">

      {referencedPost && (
        <div className="repost-banner">
          ↪ Reposted from{' '}
          <Link to={`/post/${referencedPost.id}`}>
            {referencedPost.title}
          </Link>
        </div>
      )}

      <h2>{post.title}</h2>

      {/* only show to the author */}
      {post.user_id === currentUser && (
        <div className="post-actions">
          <Link to={`/edit/${id}`} className="edit-button">
            Edit &nbsp;✏️
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Delete &nbsp;🗑️
          </button>
        </div>
      )}

      {post.image_url && (
        <div className="post-image-container">
          <img src={post.image_url} alt={post.title} className="post-image" />
        </div>
      )}
      <p className="content">{post.content}</p>

      <div className="upvote-section">
        <button onClick={handleUpvote}>👍 &nbsp;Upvote</button>
        <span>{post.upvotes || 0} {post.upvotes === 1 ? 'upvote' : 'upvotes'}</span>
      </div>

      <h3>Comments</h3>

      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>

      <ul className="comment-list">
        {comments.map(c => (
          <li key={c.id}>{c.content}</li>
        ))}
      </ul>

    </div>
  )
}
