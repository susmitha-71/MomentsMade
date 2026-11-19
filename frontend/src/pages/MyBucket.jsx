
import { useEffect, useState } from "react";

function MyBucket() {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    async function loadExperiences() {
      try {
        const response = await fetch(
          "https://momentsmade.onrender.com/api/experiences"
        );

        if (!response.ok) {
          throw new Error("Could not load experiences");
        }

        const data = await response.json();

        setExperiences(
          data.map(item => ({
            ...item,
            id: item._id
          }))
        );
      } catch (error) {
        console.error("Loading error:", error);
      }
    }

    loadExperiences();
  }, []);

  function deleteExperience() {
    alert("Delete is temporarily disabled. Your experience has not been deleted.");
  }

  return (
    <div className="page-container">
      <section className="page-heading">
        <p className="hero-tag">YOUR PERSONAL COLLECTION</p>
        <h1>
          My <span>Bucket.</span>
        </h1>
        <p>
          All the wonderful experiences you've collected.
        </p>
      </section>

      <div className="bucket-count">
        <h2>{experiences.length}</h2>
        <p>Experiences Saved</p>
      </div>

      {experiences.length === 0 ? (
        <div className="empty-state">
          <h2>Your bucket is waiting!</h2>
          <p>
            Start adding your memorable experiences.
          </p>
        </div>
      ) : (
        <div className="experience-grid">
          {experiences.map(item => (
            <div className="experience-card" key={item.id}>
              {item.image && (
                <img src={item.image} alt={item.title} />
              )}

              <div className="card-content">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <small>{item.date}</small>

                <button
                  className="delete-btn"
                  onClick={deleteExperience}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBucket;
