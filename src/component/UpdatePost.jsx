import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../service/userservice';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    content: '',
    type: '',
    images: [], // base64 strings
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

useEffect(() => {
  const fetchPost = async () => {
    try {
      const response = await userService.getPostById(postId);
      setPostData(response.data); // Use response.data, not response directly
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  };

  fetchPost();
}, [postId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  // Convert selected files to base64 strings
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              // Remove prefix like "data:image/png;base64," if needed
              const base64String = reader.result.split(',')[1];
              resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
          })
      )
    )
      .then((base64Images) => {
        setPostData((prev) => ({
          ...prev,
          images: base64Images,
        }));
      })
      .catch((error) => {
        console.error('Error converting files to base64:', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send JSON, not FormData
      await userService.updatePost(postId, postData);
      alert('Post updated successfully');
      navigate('/user/profile');
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('Failed to update post.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
      
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={postData.content}
            onChange={handleChange}
            rows={5}
            style={{ width: '100%' }}
            required
          />
        </div>

        <div>
          <label>Upload Images:</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
