import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../utils/client'
import { getCurrentUserId } from '../utils/auth'

import './styles/CreatePost.css'


function CreatePost() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const [loading, setLoading] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')


  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setErrorMsg('Title is required.')
      return
    }

    setLoading(true)
    const currentUser = getCurrentUserId()
    // const payload = {
    //   title,
    //   content,
    //   image_url: imageUrl,
    //   user_id: currentUser,
    //   reference_id: referenceId || null
    // }
    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, content, image_url: imageUrl, user_id: currentUser, reference_id: referenceId || null }])
      .select()

    if (error) {
      console.error(error)
      setErrorMsg('Something went wrong. Try again.')
    } else {
      setSuccessMsg('Post created successfully!')
      setErrorMsg('')
      setTimeout(() => {
        navigate(`/post/${data[0].id}`)
        setTitle('')
        setContent('')
        setImageUrl('')
        setReferenceId('')
      }, 1000)
    }
    setLoading(false)
  }


  return (
    <div className="create-post">

      <h2>😋 &nbsp;Share a Recipe!</h2>

      <form onSubmit={handleSubmit} className="form-box">
        <label>Title</label>
        <input
          type="text"
          placeholder="e.g., Grandma's Apple Pie"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Description (optional)</label>
        <textarea
          placeholder="Write your recipe or story here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <label>Image URL (optional)</label>
        <input
          type="text"
          placeholder="https://example.com/pie.jpg"
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

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>

        {errorMsg && <p className="error-message">{errorMsg}</p>}
        {successMsg && <p className="success-message">{successMsg}</p>}
      </form>
      
    </div>
  )
}

export default CreatePost
