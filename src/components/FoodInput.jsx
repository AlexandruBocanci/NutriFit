import { useState } from 'react';
import "./FoodInput.css";

export default function FoodInput({ onFoodAdd }) {
  const apiKey = import.meta.env.VITE_USDA_API_KEY;
  const [foodName, setFoodName] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
    if (foodName.trim() !== '') {
      fetchFoodData(foodName);
    }
  };

  const handleFoodSelect = (foodId) => {
    setSelectedFoodId(foodId === selectedFoodId ? null : foodId);
  };

  const handleAddFood = (food) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`; // Format: "DD/MM/YYYY"
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
  
    // Salvare în localStorage pentru data curentă
    const savedData = JSON.parse(localStorage.getItem(formattedDate)) || [];
    const updatedData = [...savedData, foodData];
    localStorage.setItem(formattedDate, JSON.stringify(updatedData));
  
    // Apelare callback pentru actualizarea listei în timp real
    if (typeof onFoodAdd === 'function') {
      onFoodAdd(foodData);
    }
  
    setSelectedFoodId(null);
    setQuantity(1); // Reset quantity după adăugare
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuantityClick = (e) => {
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
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)} 
                      placeholder="Quantity (g)"
                      className="quantity-input"
                      onClick={handleQuantityClick}
                      min="1"
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
