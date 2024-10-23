import { useState, useEffect } from "react"; // Import necessary hooks from React
import "./FoodCalculator.css"; // Import CSS for styling
import ProgressBar from "./ProgressBar"; // Import ProgressBar component

export default function FoodCalculator({ foodList }) {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [proteinIntake, setProteinIntake] = useState(0);
  const [carbIntake, setCarbIntake] = useState(0);
  const [fatIntake, setFatIntake] = useState(0);
  const [dailyProteinGoal, setDailyProteinGoal] = useState(0);
  const [dailyCarbGoal, setDailyCarbGoal] = useState(0);
  const [dailyFatGoal, setDailyFatGoal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
  });
  const [foodsForSelectedDate, setFoodsForSelectedDate] = useState([]);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings) {
      dailyCalorieCalculator(savedSettings);
    }
  }, []);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(selectedDate)) || [];
    setFoodsForSelectedDate(savedData);

    // Calculate total nutrient intake for the selected date
    const totalNutrients = savedData.reduce(
      (acc, food) => {
        acc.kcal += food.kcal; // Sum calories
        acc.protein += food.protein; // Sum protein
        acc.carbs += food.carbs; // Sum carbohydrates
        acc.fats += food.fats; // Sum fats
        return acc; // Return accumulated values
      },
      { kcal: 0, protein: 0, carbs: 0, fats: 0 } // Initial accumulator values
    );

    // Update current intake state with calculated totals
    setCurrentIntake(Math.floor(totalNutrients.kcal));
    setProteinIntake(Math.floor(totalNutrients.protein));
    setCarbIntake(Math.floor(totalNutrients.carbs));
    setFatIntake(Math.floor(totalNutrients.fats));
  }, [foodList, selectedDate]);

  function dailyCalorieCalculator(savedSettings) {
    const currentWeight = parseFloat(savedSettings.currentWeight);
    const height = parseFloat(savedSettings.height);
    const age = parseFloat(savedSettings.age);

    // Validate the user settings
    if (isNaN(currentWeight) || isNaN(height) || isNaN(age)) {
      console.error("Invalid user settings:", savedSettings);
      return; // Exit if invalid
    }

    // Calculate Basal Metabolic Rate (BMR) based on gender
    let bmr;
    if (savedSettings.gender === "Male") {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    const activityMultiplier = activityMultipliers[savedSettings.activityLevel];
    if (!activityMultiplier) {
      console.error("Invalid activity level:", savedSettings.activityLevel);
      return; // Exit if invalid activity level
    }

    let dailyCalories = bmr * activityMultiplier; // Calculate daily calorie needs
    const weeklyGoal = parseFloat(savedSettings.weeklyGoal);

    // Adjust calories based on weekly goal
    if (weeklyGoal === -1) {
      dailyCalories -= 1000; // For rapid weight loss
    } else if (weeklyGoal === -0.5) {
      dailyCalories -= 500; // For gradual weight loss
    } else if (weeklyGoal === 0.25) {
      dailyCalories += 250; // For gradual weight gain
    } else if (weeklyGoal === 0.5) {
      dailyCalories += 500; // For rapid weight gain
    }

    setDailyCalories(Math.floor(dailyCalories));

    // Calculate macronutrient goals
    const proteinGoal = (dailyCalories * 0.20) / 4; // 20% of calories from protein
    const carbGoal = (dailyCalories * 0.55) / 4;    // 55% of calories from carbohydrates
    const fatGoal = (dailyCalories * 0.25) / 9;     // 25% of calories from fats

    // Update state with calculated macronutrient goals
    setDailyProteinGoal(Math.floor(proteinGoal));
    setDailyCarbGoal(Math.floor(carbGoal));
    setDailyFatGoal(Math.floor(fatGoal));
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDeleteFood = (index) => {
    const updatedFoods = foodsForSelectedDate.filter((_, i) => i !== index); // Remove food item by index
    setFoodsForSelectedDate(updatedFoods);

    // Update localStorage with the new food list
    localStorage.setItem(selectedDate, JSON.stringify(updatedFoods));

    // Recalculate total nutrients after deletion
    const totalNutrients = updatedFoods.reduce(
      (acc, food) => {
        acc.kcal += food.kcal;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
        return acc; // Return accumulated values
      },
      { kcal: 0, protein: 0, carbs: 0, fats: 0 } // Initial values
    );

    // Update intake states with recalculated totals
    setCurrentIntake(Math.floor(totalNutrients.kcal));
    setProteinIntake(Math.floor(totalNutrients.protein));
    setCarbIntake(Math.floor(totalNutrients.carbs));
    setFatIntake(Math.floor(totalNutrients.fats));
  };

  return (
    <div className="food-calculator">
      <p>Calories: {currentIntake} kcal / {dailyCalories} kcal</p>
      <ProgressBar current={currentIntake} goal={dailyCalories} color="#D9534F" />

      <p>Protein: {proteinIntake}g / {dailyProteinGoal}g</p>
      <ProgressBar current={proteinIntake} goal={dailyProteinGoal} color="#F0A500" />

      <p>Carbs: {carbIntake}g / {dailyCarbGoal}g</p>
      <ProgressBar current={carbIntake} goal={dailyCarbGoal} color="#5BC0BE" />

      <p>Fats: {fatIntake}g / {dailyFatGoal}g</p>
      <ProgressBar current={fatIntake} goal={dailyFatGoal} color="#FF6F61" />
      
      <input 
        type="date" 
        value={selectedDate} 
        onChange={handleDateChange} 
        className="date-selector" 
      />

      <div className="food-list">
        {foodsForSelectedDate.map((food, index) => (
          <div key={index} className="food-item">
            <p>{food.description}</p>
            <p>
              <span className="food-kcal">{food.kcal} kcal</span>
              <span className="food-protein"> {food.protein}g protein</span>
              <span className="food-carbohydrate"> {food.carbs}g carbs</span>
              <span className="food-fat"> {food.fats}g fats</span>
            </p>
            <button className="delete-button" onClick={() => handleDeleteFood(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
