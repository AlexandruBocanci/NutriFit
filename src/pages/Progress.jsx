import React from "react";
import WeightHistory from "../components/WeightHistory";
import MacrosHistory from "../components/MacrosHistory";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page-content">
      <WeightHistory />
      <MacrosHistory />
    </div>
  );
}
