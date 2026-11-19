
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [experiences, setExperiences] = useState([]);

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
        setExperiences(data);
      } catch (error) {
        console.error("Loading error:", error);
      }
    }

    loadExperiences();
  }, []);

  const recentExperiences = [...experiences]
    .sort((a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 3);

  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="home-label">WELCOME TO MOMENTS MADE</p>

          <h1>
            Every Experience
            <br />
            Has a <span>Story.</span>
          </h1>

          <p className="hero-description">
            Your memories, achievements, adventures and life lessons
            deserve to be remembered. Share your journey and discover
            stories from others.
          </p>

          <div className="hero-buttons">
            <Link to="/explore" className="primary-btn">
              Explore Stories →
            </Link>

            <Link to="/create" className="secondary-btn">
              + Share Your Story
            </Link>
          </div>

          <div className="hero-note">
            ✦ Every moment matters. Every story counts.
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-symbol">M.</div>
          <p>Moments become memories.</p>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="home-intro">
        <p className="home-label">MORE THAN JUST MEMORIES</p>
        <h2>Your Journey. Your Stories.</h2>
        <p>
          A place to celebrate your achievements, share your experiences,
          and get inspired by the journeys of others.
        </p>
      </section>

      {/* FEATURES */}
      <section className="home-features">
        <div className="feature-card">
          <span>✍️</span>
          <h3>Share Experiences</h3>
          <p>Turn your special moments and life lessons into stories.</p>
        </div>

        <div className="feature-card">
          <span>🌍</span>
          <h3>Explore Stories</h3>
          <p>Discover interesting experiences shared by others.</p>
        </div>

        <div className="feature-card">
          <span>❤️</span>
          <h3>Keep Memories</h3>
          <p>Collect the experiences that mean something to you.</p>
        </div>
      </section>

      {/* RECENT EXPERIENCES */}
      <section className="home-recent">
        <div className="recent-heading">
          <div>
            <p className="home-label">COMMUNITY STORIES</p>
            <h2>Recently Shared</h2>
          </div>

          <Link to="/explore" className="view-all">
            View all →
          </Link>
        </div>

        {recentExperiences.length > 0 ? (
          <div className="recent-grid">
            {recentExperiences.map((item) => (
              <article className="recent-card" key={item._id}>
                {item.image && (
                  <img src={item.image} alt={item.title} />
                )}

                <div className="recent-card-content">
                  <span>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>
                    {String(item.description || "").length > 100
                      ? String(item.description).slice(0, 100) + "..."
                      : item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <span>📖</span>
            <h3>Your story could be the first!</h3>
            <p>Be the first to share an experience with the community.</p>
            <Link to="/create" className="primary-btn">
              Create Your First Story →
            </Link>
          </div>
        )}
      </section>

      {/* QUOTE */}
      <section className="home-quote">
        <h2>Collect moments, not just memories.</h2>
        <p>Some stories are worth sharing forever.</p>
      </section>

    </div>
  );
}

export default Home;
