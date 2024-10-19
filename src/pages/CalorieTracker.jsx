import FoodInput from "../components/FoodInput"
import FoodCalculator from "../components/FoodCalculator";
import "./CalorieTracker.css"

export default function HomePage() {
  return (
    <div className="components">
      <FoodInput />
      <FoodCalculator/>
    </div>
  );
}