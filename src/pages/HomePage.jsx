import './HomePage.css'
import WeightHistory from "../components/WeightHistory"
import FoodCalculator from "../components/FoodCalculator"

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
          <img src="./src/assets/CalorieTracker.png" className='calorie-tracker-img' />
          <a href="/tracker">Start Tracking</a>
        </div>
        <div className="feature" id="progress-overview">
          <h2>Progress Overview</h2>
          <p>View your fitness journey and see how much you've improved.</p>
          <img src="./src/assets/WeightGraph.png" className='weight-graph-img' />
          <a href="/progress">View Progress</a>
        </div>
        <div className="feature" id="set-goals">
          <h2>Set up your account</h2>
          <p>Fill up or update your account's info and achieve your goals!</p>
          <img src="./src/assets/Account.png" className='account-img' />
          <a href="/account">Set up Account</a>
        </div>
      </div>

    </>
  );
}

