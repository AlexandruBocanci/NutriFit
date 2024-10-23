import { useState } from 'react';
import "./FoodInput.css";

export default function FoodInput({ onFoodAdd }) {
  const apiKey = import.meta.env.VITE_USDA_API_KEY; // API key for accessing food data
  const [foodName, setFoodName] = useState(''); // State for storing food name input
  const [foodResults, setFoodResults] = useState([]); // State for storing fetched food results
  const [selectedFoodId, setSelectedFoodId] = useState(null); // State for storing selected food ID
  const [quantity, setQuantity] = useState(1); // State for storing quantity input

  // Function to fetch food data from the USDA API based on the food name
  const fetchFoodData = async (foodName) => {
    try {
      const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`);
      const data = await response.json();
      console.log(data);

      // Update food results state based on fetched data
      if (data.foods) {
        setFoodResults(data.foods);
      } else {
        setFoodResults([]); // Clear results if none found
      }
    } catch (error) {
      console.error('Error fetching food data:', error);
      setFoodResults([]); // Clear results on error
    }
  };

  const handleSearch = () => {
    // Trigger food data fetch if food name is not empty
    if (foodName.trim() !== '') {
      fetchFoodData(foodName);
    }
  };

  const handleFoodSelect = (foodId) => {
    // Toggle selection of food item
    setSelectedFoodId(foodId === selectedFoodId ? null : foodId);
  };

  const handleAddFood = (food) => {
    // Validate quantity input
    if (!quantity) {
      alert("Must introduce a valid quantity");
      setQuantity(1); // Reset quantity to 1
      return;
    }

    const today = new Date();
    // Format date as "DD/MM/YYYY"
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`; 
    
    // Calculate nutritional values based on quantity
    const kcal = Math.floor(quantity * (food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 0));
    const protein = Math.floor(quantity * (food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Protein')?.value || 0));
    const carbs = Math.floor(quantity * (food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Carbohydrate, by difference')?.value || 0));
    const fats = Math.floor(quantity * (food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Total lipid (fat)')?.value || 0));
  
    const foodData = {
      description: food.description,
      kcal,
      protein,
      carbs,
      fats
    };
  
    // Save food data to localStorage for the current date
    const savedData = JSON.parse(localStorage.getItem(formattedDate)) || [];
    const updatedData = [...savedData, foodData];
    localStorage.setItem(formattedDate, JSON.stringify(updatedData));
  
    // Call the onFoodAdd callback to update the food list in real-time
    if (typeof onFoodAdd === 'function') {
      onFoodAdd(foodData);
    }
    setSelectedFoodId(null); // Deselect food item after adding
    setQuantity(1); // Reset quantity input
  };
  
  const handleKeyDown = (e) => {
    // Trigger search on pressing Enter key
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuantityClick = (e) => {
    // Prevent click event from bubbling up
    e.stopPropagation();
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

                {selectedFoodId === food.fdcId && (
                  <div className="food-quantity">
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(parseFloat(e.target.value))} 
                      placeholder="Quantity (g)"
                      className="quantity-input"
                      onClick={handleQuantityClick}
                      min="1" // Ensure quantity is at least 1
                    />
                    <button 
                      onClick={() => handleAddFood(food)}
                      className="add-button"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
