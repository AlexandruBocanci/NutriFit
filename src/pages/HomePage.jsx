import './HomePage.css'


export default function HomePage() {
  return (
    <>
      
      <div className="home-container">
        <h1>Welcome to NutriFit</h1>
        <p>Your journey to a healthier lifestyle starts here.</p>
      </div>

      <div className="features">
        <div className="feature" id="track-calories">
          <h2>Track Calories</h2>
          <p>Monitor your daily intake and stay on track with your goals.</p>
          <a href="/tracker">Start Tracking</a>
        </div>
        <div className="feature" id="progress-overview">
          <h2>Progress Overview</h2>
          <p>View your fitness journey and see how much you've improved.</p>
          <a href="/progress">View Progress</a>
        </div>
        <div className="feature" id="set-goals">
          <h2>Update Weight</h2>
          <p>Update your today's weight .</p>
          <a href="/account">Quick Add</a>
        </div>
      </div>

    </>
  );
}

