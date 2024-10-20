import { useState, useEffect } from "react";
import FoodInput from "../components/FoodInput";
import FoodCalculator from "../components/FoodCalculator";
import "./CalorieTracker.css";

export default function CalorieTracker() {
  const [foodList, setFoodList] = useState([]);


  const handleFoodAdd = (foodData) => {
    // Actualizăm lista locală de alimente
    setFoodList((prevList) => {
      const updatedList = [...prevList, foodData];

      // Salvăm noua listă în localStorage
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(today, JSON.stringify(updatedList));

      return updatedList;
    });
  };
  
  useEffect(() => {
    // La montare, încărcăm alimentele din localStorage pentru data curentă
    const today = new Date().toISOString().split("T")[0];
    const savedData = JSON.parse(localStorage.getItem(today)) || [];
    setFoodList(savedData);
  }, []);


  return (
    <div className="components">
      <FoodInput onFoodAdd={handleFoodAdd} />
      <FoodCalculator foodList={foodList} />
    </div>
  );
}
