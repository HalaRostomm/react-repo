import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../service/userservice';

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    content: '',
    type: '',
    images: [],
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await userService.getPostById(postId);
        setPostData(response.data);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
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
      await userService.updatePost(postId, postData);
      alert('Post updated successfully');
      navigate('/user/profile');
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('Failed to update post.');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        .update-post-container {
          max-width: 700px;
          margin: 3rem auto;
          padding: 1rem;
        }

        .update-post-card {
          background-color: rgba(19, 182, 185, 0.2); /* #13B6B9 with 20% opacity */
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(19, 182, 185, 0.2);
        }

        .update-post-header {
          background-color: #13B6B9;
          color: white;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 8px;
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #000;
        }

        textarea,
        input[type='file'] {
          width: 100%;
          padding: 0.6rem;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .update-btn {
          background-color: #FFA100;
          color: black;
          border: none;
          padding: 0.8rem 1.5rem;
          font-weight: bold;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .update-btn:hover {
          background-color: #e89500;
        }
      `}</style>

      <div className="update-post-container">
        <div className="update-post-card">
          <h2 className="update-post-header">✏️ Edit Post</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Content:</label>
              <textarea
                name="content"
                value={postData.content}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Images:</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            </div>

            <button type="submit" className="update-btn">
              🔄 Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePost;
