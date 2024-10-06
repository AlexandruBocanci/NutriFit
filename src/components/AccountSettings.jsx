import { useState, useEffect } from 'react';
import './AccountSettings.css';
import { useBeforeUnload } from 'react-router-dom';

export default function AccountSettings({ onSave }) {
  console.log('AccountSettings component rendered');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [age, setAge] = useState('');

  // Load saved settings from localStorage when the component mounts
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    console.log(savedSettings);
    if (savedSettings) {
      setGender(savedSettings.gender || '')
      setAge(savedSettings.age || '')
      setHeight(savedSettings.height || '');
      setCurrentWeight(savedSettings.currentWeight || '');
      setGoalWeight(savedSettings.goalWeight || '');
      setWeeklyGoal(savedSettings.weeklyGoal || '');
      setActivityLevel(savedSettings.activityLevel || '');
    }
  }, []);

  // Function to collect user input into an object
  const getUserInfo = () => ({
    gender,
    age,
    height,
    currentWeight,
    goalWeight,
    weeklyGoal,
    activityLevel,
  });

  // Function to handle saving settings
  const handleSave = () => {
    const userInfo = getUserInfo();
    
    // Validation
    const currentAge = parseFloat(userInfo.age);
    const currentWeightNum = parseFloat(userInfo.currentWeight);
    const goalWeightNum = parseFloat(userInfo.goalWeight);
    const weeklyGoalNum = parseFloat(userInfo.weeklyGoal);

    if (!currentAge || ! weeklyGoalNum || !goalWeightNum || !currentWeightNum || !weeklyGoalNum) {
      alert("You must complete all sections !");
      return; // Stop execution if validation fails
    } else if (weeklyGoalNum < 0 && goalWeightNum >= currentWeightNum + weeklyGoalNum) {
      alert("Your goal weight must be lower than your current weight minus the weekly goal.");
      return; // Stop execution if validation fails
    } else if (weeklyGoalNum > 0 && goalWeightNum <= currentWeightNum + weeklyGoalNum) {
      alert("Your goal weight must be higher than your current weight plus the weekly goal.");
      return; // Stop execution if validation fails
    }

    if (onSave) {
      onSave(userInfo); // Pass the user info back to the parent component or page
    }
    
    localStorage.setItem('userSettings', JSON.stringify(userInfo)); // Save to local storage

    window.location.href = '/tracker'; // Navigate to profile page
  };

  return (
    <div className='account-info'>
      <div className='page-title'>
        <h2>Customize your account settings!</h2>
      </div>

      <SelectField
        label='Gender'
        value={gender}
        onChange={setGender}
        options={[
          { value: '', text: 'Select your gender', disabled: true },
          { value: 'Male', text: 'Male'},
          { value: 'Female', text: 'Female' },
        ]}
      />

      <InputField
        label='Age'
        type='number'
        placeholder='Enter your age'
        value={age}
        onChange={setAge}
      />

      <InputField
        label='Height (centimeters)'
        type='number'
        placeholder='Enter your height in centimeters'
        value={height}
        onChange={setHeight}
      />

      <InputField
        label='Current Weight (kg)'
        type='number'
        placeholder='Enter your current weight'
        value={currentWeight}
        onChange={setCurrentWeight}
      />

      <InputField
        label='Goal Weight (kg)'
        type='number'
        placeholder='Enter your goal weight'
        value={goalWeight}
        onChange={setGoalWeight}
      />

      <SelectField
        label='Weekly Goal'
        value={weeklyGoal}
        onChange={setWeeklyGoal}
        options={[
          { value: '', text: 'Select your weekly goal', disabled: true },
          { value: '-1', text: 'Lose 1kg per week' },
          { value: '-0.5', text: 'Lose 0.5kg per week' },
          { value: '0', text: 'Maintain weight' },
          { value: '0.25', text: 'Gain 0.25kg per week' },
          { value: '0.5', text: 'Gain 0.5kg per week' },
        ]}
      />

      <SelectField
        label='Activity Level'
        value={activityLevel}
        onChange={setActivityLevel}
        options={[
          { value: '', text: 'How active are you?', disabled: true },
          { value: 'sedentary', text: 'Sedentary (little or no exercise)' },
          { value: 'light', text: 'Lightly active (light exercise/sports 1-3 days/week)' },
          { value: 'moderate', text: 'Moderately active (moderate exercise/sports 3-5 days/week)' },
          { value: 'very_active', text: 'Very active (hard exercise/sports 6-7 days/week)' },
          { value: 'extra_active', text: 'Extra active (very hard exercise/physical job)' },
        ]}
      />
      <br />
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
}

// Reusable InputField component for better code organization
const InputField = ({ label, type, placeholder, value, onChange }) => (
  <>
    <h4>{label}</h4>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </>
);

// Reusable SelectField component for better code organization
const SelectField = ({ label, value, onChange, options }) => (
  <>
    <h4>{label}</h4>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option, index) => (
        <option key={index} value={option.value} disabled={option.disabled}>
          {option.text}
        </option>
      ))}
    </select>
  </>
);
