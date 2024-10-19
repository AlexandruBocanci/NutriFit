import { useState, useEffect } from "react";
import "./FoodCalculator.css";
import ProgressBar from "./ProgressBar";

export default function FoodCalculator() {
  const [dailyCalories, setDailyCalories] = useState(2000); // Example daily calorie goal
  const [currentIntake, setCurrentIntake] = useState(1000); // Example current intake
  const [proteinIntake, setProteinIntake] = useState(0);
  const [carbIntake, setCarbIntake] = useState(0);
  const [fatIntake, setFatIntake] = useState(0);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
    if (savedSettings) {
      dailyCalorieCalculator(savedSettings);
    }
  }, []);

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

    const dailyCalories = bmr * activityMultiplier;
    let calorieAdjustment = dailyCalories;
    const weeklyGoal = parseFloat(savedSettings.weeklyGoal);

    if (weeklyGoal < 0) {
      calorieAdjustment -= 500; // Losing weight
    } else if (weeklyGoal > 0) {
      calorieAdjustment += 250; // Gaining weight
    }

    setDailyCalories(Math.floor(calorieAdjustment));

    const proteinRatio = 0.25;
    const carbRatio = 0.50;
    const fatRatio = 0.25;

    const proteinGrams = (calorieAdjustment * proteinRatio) / 4;
    const carbGrams = (calorieAdjustment * carbRatio) / 4;
    const fatGrams = (calorieAdjustment * fatRatio) / 9;

    setProteinIntake(Math.floor(proteinGrams));
    setCarbIntake(Math.floor(carbGrams));
    setFatIntake(Math.floor(fatGrams));
  }

  return (
    <div className="food-calculator">
      <p>Calories: {currentIntake} kcal / {dailyCalories} kcal</p>
      <ProgressBar current={currentIntake} goal={dailyCalories} color="#D9534F" />

      <p>Protein: {proteinIntake}g</p>
      <ProgressBar current={proteinIntake} goal={200} color="#F0A500" /> {/* Example protein goal */}

      <p>Carbs: {carbIntake}g</p>
      <ProgressBar current={carbIntake} goal={300} color="#5BC0BE" /> {/* Example carb goal */}

      <p>Fats: {fatIntake}g</p>
      <ProgressBar current={fatIntake} goal={70} color="#FF6F61" /> {/* Example fat goal */}
    </div>
  );
}
