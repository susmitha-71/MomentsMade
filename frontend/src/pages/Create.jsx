
import { useState } from "react";

function Create() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setError("Image size must be below 1.5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
      setImageUrl("");
      setError("");
    };

    reader.readAsDataURL(file);
  }

  function handleImageUrl(value) {
    setImageUrl(value);
    setImage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in the title and description.");
      return;
    }

    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl.trim());

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL");
        }
      } catch {
        setError("Please enter a valid image URL.");
        return;
      }
    }

    const experience = {
      title: title.trim(),
      category,
      description: description.trim(),
      image: image || imageUrl.trim(),
      date: new Date().toLocaleDateString()
    };

    try {
      const response = await fetch(
        "https://momentsmade.onrender.com/api/experiences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(experience)
        }
      );

      if (!response.ok) {
        throw new Error("Could not save experience");
      }

      alert("Your experience has been published!");

      setTitle("");
      setCategory("Personal");
      setDescription("");
      setImage("");
      setImageUrl("");
    } catch {
      setError("Could not save your experience. Please check your backend connection.");
    }
  }

  const previewImage = image || imageUrl.trim();

  return (
    <section className="page-container create-page">
      <div className="page-heading">
        <p className="eyebrow">YOUR STORY MATTERS</p>
        <h1>Create an Experience</h1>
        <p>Share a memory, achievement, or moment worth remembering.</p>
      </div>

      <form className="create-form" onSubmit={handleSubmit}>
        <label>Experience Title</label>
        <input
          type="text"
          placeholder="Give your experience a title..."
          value={title}
          maxLength={80}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <small>{title.length}/80 characters</small>

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Travel</option>
          <option>Achievements</option>
          <option>Education</option>
          <option>Adventure</option>
          <option>Personal</option>
          <option>Other</option>
        </select>

        <label>Your Story</label>
        <textarea
          placeholder="Tell everyone what happened..."
          value={description}
          maxLength={1500}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          required
        />
        <small>{description.length}/1500 characters</small>

        <div className="image-options">
          <label>Upload an Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />

          <p className="image-or">OR</p>

          <label>Paste Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => handleImageUrl(e.target.value)}
          />
          <small>Use a direct link to an image that is publicly accessible.</small>
        </div>

        {previewImage && (
          <div className="image-preview">
            <p>Image Preview</p>
            <img
              src={previewImage}
              alt="Experience preview"
              onError={() => setError("This image could not be loaded. Check the image URL.")}
            />
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => {
                setImage("");
                setImageUrl("");
                setError("");
              }}
            >
              ✕ Remove Image
            </button>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="primary-btn">
          Publish Experience →
        </button>
      </form>
    </section>
  );
}

export default Create;
