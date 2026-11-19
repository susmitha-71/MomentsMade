
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Explore() {
  const [experiences, setExperiences] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [liked, setLiked] = useState({});
  const [comments, setComments] = useState({});
  const [openComments, setOpenComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});

  const categories = [
    "All", "Travel", "Achievements", "Education",
    "Adventure", "Personal", "Other"
  ];

  useEffect(() => {
    async function loadExperiences() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/experiences"
        );

        if (!response.ok) {
          throw new Error("Could not load experiences");
        }

        const data = await response.json();

        const formattedExperiences = data.map(item => ({
          ...item,
          id: item._id
        }));

        setExperiences(formattedExperiences);
      } catch (error) {
        console.error("Loading experiences error:", error);
      }
    }

    loadExperiences();

    try {
      const savedLikes = JSON.parse(
        localStorage.getItem("momentLikes") || "{}"
      );

      const savedComments = JSON.parse(
        localStorage.getItem("momentComments") || "{}"
      );

      setLiked(
        savedLikes && typeof savedLikes === "object" && !Array.isArray(savedLikes)
          ? savedLikes : {}
      );

      const safeComments = {};

      if (savedComments && typeof savedComments === "object") {
        Object.keys(savedComments).forEach(id => {
          const list = Array.isArray(savedComments[id])
            ? savedComments[id] : [];

          safeComments[id] = list.map(comment => {
            if (typeof comment === "string") return comment;

            if (comment && typeof comment === "object") {
              return String(
                comment.text || comment.comment || comment.message || ""
              );
            }

            return String(comment ?? "");
          }).filter(Boolean);
        });
      }

      setComments(safeComments);
      localStorage.setItem(
        "momentComments",
        JSON.stringify(safeComments)
      );
    } catch (error) {
      console.error("Loading error:", error);
    }
  }, []);

  function getComments(id) {
    return Array.isArray(comments[id]) ? comments[id] : [];
  }

  function getLikeCount(id) {
    return liked[id] ? 1 : 0;
  }

  function toggleLike(id) {
    const updated = { ...liked, [id]: !liked[id] };
    setLiked(updated);
    localStorage.setItem("momentLikes", JSON.stringify(updated));
  }

  function toggleReadMore(id) {
    setExpandedPosts(previous => ({
      ...previous,
      [id]: !previous[id]
    }));
  }

  async function deleteExperience(id) {
    if (!window.confirm("Delete this experience?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/experiences/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Could not delete experience");
      }

      const updatedExperiences = experiences.filter(
        item => item.id !== id
      );

      const updatedLikes = { ...liked };
      const updatedComments = { ...comments };

      delete updatedLikes[id];
      delete updatedComments[id];

      setExperiences(updatedExperiences);
      setLiked(updatedLikes);
      setComments(updatedComments);

      localStorage.setItem(
        "momentLikes",
        JSON.stringify(updatedLikes)
      );

      localStorage.setItem(
        "momentComments",
        JSON.stringify(updatedComments)
      );

    } catch (error) {
      alert("Could not delete experience. Please try again.");
      console.error(error);
    }
  }

  function addComment(id) {
    const text = newComment.trim();
    if (!text) return;

    const updated = {
      ...comments,
      [id]: [...getComments(id), text]
    };

    setComments(updated);
    localStorage.setItem("momentComments", JSON.stringify(updated));
    setNewComment("");
  }

  const filtered = experiences
    .filter(item => {
      const title = String(item.title || "").toLowerCase();
      const description = String(item.description || "").toLowerCase();

      return (
        (title.includes(search.toLowerCase()) ||
          description.includes(search.toLowerCase())) &&
        (category === "All" || item.category === category)
      );
    })
    .sort((a, b) =>
      sort === "latest"
        ? new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        : new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );

  return (
    <section className="page-container explore-page">
      <div className="page-heading">
        <p className="eyebrow">DISCOVER STORIES</p>
        <h1>Explore Experiences</h1>
        <p>Discover moments, achievements and stories from others.</p>
      </div>

      <div className="explore-toolbar">
        <input
          type="search"
          placeholder="🔍 Search experiences..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="explore-filter-heading">
        <h3>Categories</h3>
        <button onClick={() => {
          setSearch("");
          setCategory("All");
          setSort("latest");
        }}>
          Clear Filters
        </button>
      </div>

      <div className="category-list">
        {categories.map(item => (
          <button
            key={item}
            className={category === item ? "selected" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="explore-results">
        <h3>All Experiences</h3>
        <span>{filtered.length} experience(s) found</span>
      </div>

      {filtered.length > 0 ? (
        <div className="experience-grid">
          {filtered.map(item => {
            const postComments = getComments(item.id);
            const description = String(item.description || "");
            const isLong = description.length > 180;
            const isExpanded = !!expandedPosts[item.id];

            return (
              <article className="experience-card" key={item.id}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || "Experience"}
                    className="experience-image"
                  />
                )}

                <div className="experience-content">
                  <span className="experience-category">{item.category}</span>
                  <h3>{item.title}</h3>

                  <p className={!isExpanded && isLong ? "description-preview" : ""}>
                    {!isExpanded && isLong
                      ? description.slice(0, 180).trimEnd() + "..."
                      : description}
                  </p>

                  {isLong && (
                    <button
                      className="read-more-btn"
                      onClick={() => toggleReadMore(item.id)}
                    >
                      {isExpanded ? "Read less ↑" : "Read more ↓"}
                    </button>
                  )}

                  <small>{item.date}</small>

                  <div className="card-actions">
                    <button
                      className={`like-count-btn ${liked[item.id] ? "liked" : ""}`}
                      onClick={() => toggleLike(item.id)}
                      title="Like"
                    >
                      <span>{liked[item.id] ? "❤️" : "🤍"}</span>
                      <small>{getLikeCount(item.id)}</small>
                    </button>

                    <button
                      className="comment-count-btn"
                      onClick={() => {
                        setOpenComments(
                          openComments === item.id ? null : item.id
                        );
                        setNewComment("");
                      }}
                      title="Comments"
                    >
                      <span>💬</span>
                      <small>{postComments.length}</small>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteExperience(item.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                  {openComments === item.id && (
                    <div className="comments-section">
                      <h4>💬 Comments ({postComments.length})</h4>

                      {postComments.length > 0 ? (
                        postComments.map((comment, index) => (
                          <div className="comment-item" key={index}>
                            {comment}
                          </div>
                        ))
                      ) : (
                        <p className="no-comments">
                          No comments yet. Start the conversation!
                        </p>
                      )}

                      <div className="comment-input">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComment}
                          maxLength={300}
                          onChange={e => setNewComment(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") addComment(item.id);
                          }}
                        />

                        <button
                          onClick={() => addComment(item.id)}
                          title="Send comment"
                        >
                          ➤
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>🔎 No experiences found</h2>
          <p>Try another search or choose a different category.</p>
          <button
            className="primary-btn"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear Search
          </button>
          <Link to="/create" className="secondary-btn">
            Share an Experience
          </Link>
        </div>
      )}
    </section>
  );
}

export default Explore;
