import { useState, useEffect } from "react"; // Import necessary hooks from React
import FoodInput from "../components/FoodInput"; // Import FoodInput component
import FoodCalculator from "../components/FoodCalculator"; // Import FoodCalculator component
import "./CalorieTracker.css"; // Import CSS for styling

export default function CalorieTracker() {
  const [foodList, setFoodList] = useState([]); // Initialize foodList state

  const handleFoodAdd = (foodData) => {
    // Update local food list with new food item
    setFoodList((prevList) => {
      const updatedList = [...prevList, foodData]; // Create a new list including the new food item

      // Save the updated list in localStorage
      const today = new Date().toISOString().split("T")[0]; // Get today's date in "YYYY-MM-DD" format
      localStorage.setItem(today, JSON.stringify(updatedList)); // Save the updated list

      return updatedList; // Return the updated food list
    });
  };
  
  useEffect(() => {
    // Load food items from localStorage when the component mounts
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    const savedData = JSON.parse(localStorage.getItem(today)) || []; // Retrieve saved data or use an empty array
    setFoodList(savedData); // Set the retrieved data to the foodList state
  }, []);

  return (
    <div className="components">
      <FoodInput onFoodAdd={handleFoodAdd} /> {/* Pass handleFoodAdd to FoodInput */}
      <FoodCalculator foodList={foodList} /> {/* Pass foodList to FoodCalculator */}
    </div>
  );
}
