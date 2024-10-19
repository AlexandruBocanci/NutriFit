import { useState, useEffect } from 'react';
import "./FoodInput.css";

export default function FoodInput() {
  const apiKey = import.meta.env.VITE_USDA_API_KEY;
  const [foodName, setFoodName] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accountSettings, setAccountSettings] = useState({});
  

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

        </div>
      )}
    </div>
  );
}
