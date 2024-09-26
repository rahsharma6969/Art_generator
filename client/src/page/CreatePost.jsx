import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField } from '../components';
import { useUserContext } from '../components/Usercontext/'; // Correct import

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useUserContext(); // Fetch user from context

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    uploadedPhoto: null,
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setForm({ ...form, uploadedPhoto: e.target.files[0] });

  const generateImage = async () => {
    if (!form.prompt) {
      alert('Please provide a prompt');
      return;
    }

    try {
      setGeneratingImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: form.prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const blob = await fetch(`data:image/jpeg;base64,${data.photo}`).then((res) => res.blob());
      const file = new File([blob], 'generated-image.jpg', { type: 'image/jpeg' });
      setForm((prev) => ({ ...prev, uploadedPhoto: file }));
    } catch (err) {
      alert(err.message);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.name) {
      alert('Please enter your name');
      setLoading(false);
      return;
    }

    if (!form.uploadedPhoto) {
      alert('Please upload an image or generate one.');
      setLoading(false);
      return;
    }

    const userId = user.id; // Directly access user ID

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('name', form.name);
      formData.append('prompt', form.prompt);
      formData.append('photo', form.uploadedPhoto);

      // Debugging FormData content
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      const response = await fetch('http://localhost:8080/api/v1/community/posts/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Post shared successfully!');
        navigate('/community');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to share post');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px]">
          Generate an image through DALL-E AI or upload your own image and share it with the community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <FormField
          labelName="Your Name"
          type="text"
          name="name"
          placeholder="Ex., John Doe"
          value={form.name}
          handleChange={handleChange}
        />

        <FormField
          labelName="Prompt"
          type="text"
          name="prompt"
          placeholder="Describe what you want to generate..."
          value={form.prompt}
          handleChange={handleChange}
        />

        <div className="mt-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        <div className="mt-5">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <p>Or upload an image</p>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
