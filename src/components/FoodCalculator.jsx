import { useState, useEffect } from "react";
import "./FoodCalculator.css";
import ProgressBar from "./ProgressBar";

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

    const totalNutrients = savedData.reduce(
      (acc, food) => {
        acc.kcal += food.kcal;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fats: 0 }
    );

    setCurrentIntake(Math.floor(totalNutrients.kcal));
    setProteinIntake(Math.floor(totalNutrients.protein));
    setCarbIntake(Math.floor(totalNutrients.carbs));
    setFatIntake(Math.floor(totalNutrients.fats));
  }, [foodList, selectedDate]);

  function dailyCalorieCalculator(savedSettings) {
    const currentWeight = parseFloat(savedSettings.currentWeight);
    const height = parseFloat(savedSettings.height);
    const age = parseFloat(savedSettings.age);

    if (isNaN(currentWeight) || isNaN(height) || isNaN(age)) {
      console.error("Invalid user settings:", savedSettings);
      return;
    }

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
      return;
    }

    let dailyCalories = bmr * activityMultiplier;
    const weeklyGoal = parseFloat(savedSettings.weeklyGoal);
    
    // Adjust calories based on weekly goal
    if (weeklyGoal === -1) {
      dailyCalories -= 1000;
    } else if (weeklyGoal === -0.5) {
      dailyCalories -= 500; 
    } else if (weeklyGoal === 0.25) {
      dailyCalories += 250; 
    } else if (weeklyGoal === 0.5) {
      dailyCalories += 500; 
    }

    setDailyCalories(Math.floor(dailyCalories));

    // Calcularea macronutrienților
    const proteinGoal = (dailyCalories * 0.20) / 4; // 20% din calorii
    const carbGoal = (dailyCalories * 0.55) / 4;    // 55% din calorii
    const fatGoal = (dailyCalories * 0.25) / 9;     // 25% din calorii

    setDailyProteinGoal(Math.floor(proteinGoal));
    setDailyCarbGoal(Math.floor(carbGoal));
    setDailyFatGoal(Math.floor(fatGoal));
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDeleteFood = (index) => {
    const updatedFoods = foodsForSelectedDate.filter((_, i) => i !== index);
    setFoodsForSelectedDate(updatedFoods);
    
    // Actualizăm localStorage
    localStorage.setItem(selectedDate, JSON.stringify(updatedFoods));

    // Recalculăm nutrientii total
    const totalNutrients = updatedFoods.reduce(
      (acc, food) => {
        acc.kcal += food.kcal;
        acc.protein += food.protein;
        acc.carbs += food.carbs;
        acc.fats += food.fats;
        return acc;
      },
      { kcal: 0, protein: 0, carbs: 0, fats: 0 }
    );

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
