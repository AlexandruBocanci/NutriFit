import { useState, useEffect } from "react";
import "./FoodCalculator.css";
import ProgressBar from "./ProgressBar";

export default function FoodCalculator({ foodList }) {
  const [dailyCalories, setDailyCalories] = useState(0);
  const [currentIntake, setCurrentIntake] = useState(0);
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

    if (weeklyGoal == "-1") {
      calorieAdjustment -= 1000;
    } else if (weeklyGoal == "-0.5") {
      calorieAdjustment -= 500; 
    } else if (weeklyGoal == "0.25") {
      calorieAdjustment += 250; 
    } else if (weeklyGoal == "0.5") {
      calorieAdjustment += 500; 
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

  useEffect(() => {
    const totalNutrients = foodList.reduce((acc, food) => {
      acc.kcal += food.kcal;
      acc.protein += food.protein;
      acc.carbs += food.carbs;
      acc.fats += food.fats;
      return acc;
    }, { kcal: 0, protein: 0, carbs: 0, fats: 0 });

    setCurrentIntake(Math.floor(totalNutrients.kcal));
    setProteinIntake(Math.floor(totalNutrients.protein));
    setCarbIntake(Math.floor(totalNutrients.carbs));
    setFatIntake(Math.floor(totalNutrients.fats));
  }, [foodList]);

  return (
    <div className="food-calculator">
      <p>Calories: {currentIntake} kcal / {dailyCalories} kcal</p>
      <ProgressBar current={currentIntake} goal={dailyCalories} color="#D9534F" />

      <p>Protein: {proteinIntake}g</p>
      <ProgressBar current={proteinIntake} goal={200} color="#F0A500" />

      <p>Carbs: {carbIntake}g</p>
      <ProgressBar current={carbIntake} goal={300} color="#5BC0BE" />

      <p>Fats: {fatIntake}g</p>
      <ProgressBar current={fatIntake} goal={70} color="#FF6F61" />

      <div className="food-list">
        {foodList.map((food, index) => (
          <div key={index} className="food-item">
            <p>{food.description}</p>
            <p>
              <span className="food-kcal">{food.kcal} kcal</span>
              <span className="food-protein"> {food.protein}g protein</span>
              <span className="food-carbohydrate"> {food.carbs}g carbs</span>
              <span className="food-fat"> {food.fats}g fats</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
