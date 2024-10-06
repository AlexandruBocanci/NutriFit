import { useState, useEffect } from 'react';

export default function FoodInput() {
  // API Key from environment variables
  const apiKey = import.meta.env.VITE_USDA_API_KEY;

  // State for food name input
  const [foodName, setFoodName] = useState('');

  // State for account settings
  const [accountSettings, setAccountSettings] = useState({});

  // Fetch food data from the USDA API
  const fetchFoodData = async (foodName) => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`);
      const data = await response.json();
      console.log(data); // Log the API response data
    } catch (error) {
      console.error('Error fetching food data:', error); // Handle any errors
    }
  };

  // Load saved account settings from localStorage when the component mounts
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setAccountSettings(savedSettings); // Set the account settings state
      dailyCalorieCalculator(savedSettings); // Calculate daily calories with the retrieved settings
    }
    console.log(savedSettings);
  }, []);

  // Calculate daily calorie needs based on account settings
  function dailyCalorieCalculator(savedSettings) {
    const currentWeight = parseFloat(savedSettings.currentWeight); // Ensure this is a number
    const height = parseFloat(savedSettings.height); // Ensure this is a number
    const age = parseFloat(savedSettings.age); // Ensure this is a number

    if (isNaN(currentWeight) || isNaN(height) || isNaN(age)) {
      console.error('Invalid user settings:', savedSettings);
      return; // Exit if values are invalid
    }

    let bmr;

    // Calculate BMR based on gender
    if (savedSettings.gender === 'Male') {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
    }

    // Activity level multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };

    // Check if the activity level is valid
    const activityMultiplier = activityMultipliers[savedSettings.activityLevel];
    if (!activityMultiplier) {
      console.error('Invalid activity level:', savedSettings.activityLevel);
      return; // Exit if activity level is invalid
    }

    // Calculate daily caloric needs
    const dailyCalories = bmr * activityMultiplier;

    // Adjust for weight goals
    let calorieAdjustment = dailyCalories;
    const weeklyGoal = parseFloat(savedSettings.weeklyGoal);

    if (weeklyGoal < 0) { // Losing weight
      calorieAdjustment -= 500; // Adjust based on goal
    } else if (weeklyGoal > 0) { // Gaining weight
      calorieAdjustment += 250; // Adjust based on goal
    }

    console.log('Total Daily Calories:', Math.floor(calorieAdjustment));
  }

  // Handle the search button click event
  const handleSearch = () => {
    fetchFoodData(foodName); // Fetch food data with the entered food name
  };

  return (
    <div>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)} // Update food name state on input change
        placeholder="Enter food name"
      />
      <button onClick={handleSearch}>Search Food</button> {/* Trigger food search */}
    </div>
  );
}
