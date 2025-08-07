import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { supabase } from '../utils/client'

import './styles/CreatePost.css'  // reuse styling


export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')


  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
      if (error) {
        console.error(error)
      } else {
        setTitle(data.title)
        setContent(data.content)
        setImageUrl(data.image_url)
        setReferenceId(data.reference_id || '')
      }
      setLoading(false)
    }
    fetchPost()
  }, [id])


  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Title is required.')
      return
    }
    setSaving(true)

    const { error } = await supabase
      .from('posts')
      .update({ title, content, image_url: imageUrl, reference_id: referenceId || null })
      .eq('id', id)

    if (error) {
      console.error(error)
      setErrorMsg('Failed to update post.')
    } else {
      setSuccessMsg('Post updated successfully!')
      setErrorMsg('')
      setTimeout(() => {
        navigate(`/post/${id}`)
      }, 1000)
    }
    setSaving(false)
  }


  if (loading) {
    return <p className="loading">Loading post...</p>
  }


  return (
    <div className="create-post">

      <h2>✏️ &nbsp;Edit Post</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g., Grandma's Apple Pie"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          placeholder="Write your recipe or story here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <label>Image URL (optional)</label>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />

        <label>Repost Post ID (optional)</label>
        <input
          type="text"
          placeholder="Enter existing post ID"
          value={referenceId}
          onChange={e => setReferenceId(e.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}
      </form>

    </div>
  )
}
