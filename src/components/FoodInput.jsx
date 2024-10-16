import { useState, useEffect } from 'react';
import "./FoodInput.css";

export default function FoodInput() {
  const apiKey = import.meta.env.VITE_USDA_API_KEY;
  const [foodName, setFoodName] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [accountSettings, setAccountSettings] = useState({});
  
  // Fetch food data from the USDA API
  const fetchFoodData = async (foodName) => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`);
      const data = await response.json();
      console.log(data); // Log the API response data

      if (data.foods) {
        setFoodResults(data.foods); // Store the search results in state
      } else {
        setFoodResults([]); // Clear results if no foods found
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
      setFoodResults([]); // Clear results on error
    }
  };

  // Load saved account settings from localStorage when the component mounts
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setAccountSettings(savedSettings);
      dailyCalorieCalculator(savedSettings);
    }
    console.log(savedSettings);
  }, []);

  function dailyCalorieCalculator(savedSettings) {
    const currentWeight = parseFloat(savedSettings.currentWeight);
    const height = parseFloat(savedSettings.height);
    const age = parseFloat(savedSettings.age);

    if (isNaN(currentWeight) || isNaN(height) || isNaN(age)) {
      console.error('Invalid user settings:', savedSettings);
      return;
    }

    let bmr;
    if (savedSettings.gender === 'Male') {
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
      console.error('Invalid activity level:', savedSettings.activityLevel);
      return;
    }

    const dailyCalories = bmr * activityMultiplier;
    let calorieAdjustment = dailyCalories;
    const weeklyGoal = parseFloat(savedSettings.weeklyGoal);

    if (weeklyGoal < 0) {
      calorieAdjustment -= 500;
    } else if (weeklyGoal > 0) {
      calorieAdjustment += 250;
    }

    console.log('Total Daily Calories:', Math.floor(calorieAdjustment));
  }

  const handleSearch = () => {
    fetchFoodData(foodName);
  };

  const handleFoodSelect = (food) => {
    console.log('Selected food:', food);
    // Handle the logic when a user selects a food item (e.g., add it to a meal tracker)
  };

    // Handle key down event
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Check if the Enter key is pressed
      handleSearch(); // Call the search function
    }
  };

  return (
    <div className='food-input'>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="🔍Enter food name"
        className='food-search'
      />
     
      
      {foodResults.length > 0 && (
        <div className="food-results">
          <div className='food-items'>
            {foodResults.map((food) => (
              <div className='each-food-item' key={food.fdcId} onClick={() => handleFoodSelect(food)}>
                <p>
                  {food.description} {Number(food.servingSize) < 1 ? Number(food.servingSize).toFixed(1):food.servingSize}{food.servingSizeUnit}
                </p>
                <p>
                    {food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 'N/A'} kcal
                
                  | {food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein')?.value || '0'}g P 
                
                  | {food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference')?.value || '0'}g C 
    
                | {food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)')?.value || '0'}g F
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
  