import React from "react";
import WeightGraph from "../components/WeightGraph";
import WeightHistory from "../components/WeightHistory";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="page-content">
      <WeightHistory />
      <WeightGraph />
    </div>
  );
}
