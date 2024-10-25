import React, { useEffect, useState } from 'react';
import MacrosGraph from './MacrosGraph';
import "./MacrosHistory.css"

export default function MacrosHistory() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedMacro, setSelectedMacro] = useState('kcal'); // kcal is default

  useEffect(() => {
    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    // Fetch data for the last 7 days from localStorage
    const fetchedData = last7Days.map(date => {
      const dayData = JSON.parse(localStorage.getItem(date)) || [];
      const dailyTotals = dayData.reduce(
        (totals, food) => ({
          kcal: totals.kcal + food.kcal,
          protein: totals.protein + food.protein,
          carbs: totals.carbs + food.carbs,
          fats: totals.fats + food.fats,
        }),
        { kcal: 0, protein: 0, carbs: 0, fats: 0 }
      );
      return { date, ...dailyTotals };
    });

    setWeeklyData(fetchedData);
  }, []);

  const handleMacroChange = (event) => {
    setSelectedMacro(event.target.value);
  };

  return (
    <div className="macros-history">
      <h2>Macros History (Last 7 Days)</h2>

      <select onChange={handleMacroChange} value={selectedMacro}>
        <option value="kcal">Calories</option>
        <option value="protein">Protein</option>
        <option value="carbs">Carbohydrates</option>
        <option value="fats">Fats</option>
      </select>

      <MacrosGraph weeklyData={weeklyData} selectedMacro={selectedMacro} />
    </div>
  );
}
