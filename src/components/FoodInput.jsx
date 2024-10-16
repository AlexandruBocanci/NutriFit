import { useState, useEffect } from 'react';
import "./FoodInput.css";

export default function FoodInput() {
  const apiKey = import.meta.env.VITE_USDA_API_KEY;
  const [foodName, setFoodName] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accountSettings, setAccountSettings] = useState({});
  const [dailyCalories, setDailyCalories] = useState(0);
  const [proteinIntake, setProteinIntake] = useState(0);
  const [carbIntake, setCarbIntake] = useState(0);
  const [fatIntake, setFatIntake] = useState(0);

  const fetchFoodData = async (foodName) => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`);
      const data = await response.json();
      console.log(data);

      if (data.foods) {
        setFoodResults(data.foods);
      } else {
        setFoodResults([]);
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
      setFoodResults([]);
    }
  };

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setAccountSettings(savedSettings);
      dailyCalorieCalculator(savedSettings);
    }
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
        calorieAdjustment -= 500; // Losing weight
    } else if (weeklyGoal > 0) {
        calorieAdjustment += 250; // Gaining weight
    }

    setDailyCalories(Math.floor(calorieAdjustment));

    // Calculate daily macronutrient needs
    const proteinRatio = 0.25; // 25% of total calories from protein
    const carbRatio = 0.50;     // 50% of total calories from carbohydrates
    const fatRatio = 0.25;      // 25% of total calories from fats

    const proteinCalories = calorieAdjustment * proteinRatio;
    const carbCalories = calorieAdjustment * carbRatio;
    const fatCalories = calorieAdjustment * fatRatio;

    // Convert calories to grams
    const proteinGrams = proteinCalories / 4;
    const carbGrams = carbCalories / 4;
    const fatGrams = fatCalories / 9;

    // Set macro intakes based on calculated grams
    setProteinIntake(Math.floor(proteinGrams));
    setCarbIntake(Math.floor(carbGrams));
    setFatIntake(Math.floor(fatGrams));

    // Log values immediately after setting
    console.log("Daily Calories:", Math.floor(calorieAdjustment));
    console.log("Protein:", Math.floor(proteinGrams));
    console.log("Carbs:", Math.floor(carbGrams));
    console.log("Fats:", Math.floor(fatGrams));
}

  const handleSearch = () => {
    fetchFoodData(foodName);
  };

  const handleFoodSelect = (foodId) => {
    setSelectedFoodId(foodId === selectedFoodId ? null : foodId);
  };

  const handleAddFood = (food) => {
    console.log('Food added to tracker:', food, 'Quantity:', quantity);
    // Add additional logic to update user's food tracker, if necessary
    setSelectedFoodId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Prevent click events from propagating when interacting with input or button
  const handleQuantityClick = (e) => {
    e.stopPropagation();
  };

  // New combined function for button click
  const handleAddButton = (e, food) => {
    e.stopPropagation(); // Prevent event from bubbling up
    handleAddFood(food); // Call the add food function
  };

  return (
    <div className='food-input'>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="🔍 Enter food name"
        className='food-search'
      />
     
      {foodResults.length > 0 && (
        <div className="food-results">
          <div className='food-items'>
            {foodResults.map((food) => (
              <div 
                className='each-food-item' 
                key={food.fdcId} 
                onClick={() => handleFoodSelect(food.fdcId)}
              >
                <p>
                  {food.description}&nbsp;&nbsp; 
                  { 
                    isNaN(Number(food.servingSize)) 
                      ? ''
                      : Number(food.servingSize) < 1 
                        ? Number(food.servingSize).toFixed(1) 
                        : Math.round(Number(food.servingSize)) 
                  } 
                  {food.servingSizeUnit}
                </p>

                <p>
                  <span className='food-kcal'>
                    {food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 'N/A'} kcal
                  </span>
                  <span className='food-protein'>
                    &nbsp;&nbsp;{food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein')?.value || '0'}g protein
                  </span>
                  <span className='food-carbohydrate'>
                    &nbsp;&nbsp;{food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference')?.value || '0'}g carbs
                  </span>
                  <span className='food-fat'>
                    &nbsp;&nbsp;{food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)')?.value || '0'}g fats
                  </span>
                </p>

                {/* Show quantity input and add button only for the selected food */}
                {selectedFoodId === food.fdcId && (
                  <div className="food-quantity">
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)} 
                      placeholder="Quantity (g)"
                      className="quantity-input"
                      onClick={handleQuantityClick} // Prevent event from bubbling up
                    />
                    <button 
                      onClick={(e) => handleAddButton(e, food)} // Use the combined handler
                      className="add-button"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Display daily calorie and macronutrient goals */}
          <div className="nutrition-summary">
            <h3>Daily Goals</h3>
            <p>Total Daily Calories: {dailyCalories} kcal</p>
            <p>Protein: {proteinIntake} g</p>
            <p>Carbohydrates: {carbIntake} g</p>
            <p>Fats: {fatIntake} g</p>
          </div>
        </div>
      )}
    </div>
  );
}
