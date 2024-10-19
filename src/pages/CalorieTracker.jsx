import { useState } from "react";
import FoodInput from "../components/FoodInput";
import FoodCalculator from "../components/FoodCalculator";
import "./CalorieTracker.css";

export default function CalorieTracker() {
  const [foodList, setFoodList] = useState([]);

  const handleFoodAdd = (foodData) => {
    setFoodList((prevList) => [...prevList, foodData]);
  };

  return (
    <div className="components">
      <FoodInput onFoodAdd={handleFoodAdd} />
      <FoodCalculator foodList={foodList} />
    </div>
  );
}
