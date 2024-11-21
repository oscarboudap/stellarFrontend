import React from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, LogarithmicScale, CategoryScale, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";

// Register necessary components
ChartJS.register(LinearScale, LogarithmicScale, CategoryScale, Title, Tooltip, Legend, PointElement, LineElement);

function HRDiagram({ starData }) {
  const sigma = 5.67037419e-8;  // Stefan-Boltzmann constant in W/m^2/K^4

  const data = {
    datasets: [
      {
        label: "Star Positions",
        data: starData, // Format: [{ x: temperature, y: luminosity }]
        backgroundColor: "red",
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 60000, // Temperature range from 60000 K to 0 K (reverse axis)
        reverse: true,
        title: {
          display: true,
          text: "Temperature (K)",
        },
        ticks: {
          callback: (value) => `${value} K`, // Add "K" to tick labels
        },
      },
      y: {
        type: "logarithmic", // Logarithmic scale for luminosity
        min: 0.0001,
        max: 100000,
        title: {
          display: true,
          text: "Luminosity (Log L / L☉)",
        },
        ticks: {
          callback: (value) => `10^${Math.log10(value).toFixed(1)}`, // Format log scale
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  // Function to generate temperature class areas with colors
  const generateTemperatureClassAreas = () => {
    const classes = [
      { start: 33000, end: 60000, color: "#0000FF", label: "O-type" }, // Blue
      { start: 10000, end: 33000, color: "#5F9EA0", label: "B-type" }, // Bluish white
      { start: 7300, end: 10000, color: "#FFFFFF", label: "A-type" }, // White
      { start: 6000, end: 7300, color: "#FFFF00", label: "F-type" }, // Yellowish white
      { start: 5300, end: 6000, color: "#FFD700", label: "G-type" }, // Yellow
      { start: 3900, end: 5300, color: "#FFA500", label: "K-type" }, // Light orange
      { start: 2300, end: 3900, color: "#FF4500", label: "M-type" }, // Light orangish red
    ];

    return classes.map((cls) => ({
      x: { min: cls.start, max: cls.end },
      color: cls.color,
      label: cls.label,
    }));
  };

  const temperatureClassAreas = generateTemperatureClassAreas();

  return (
    <div
      style={{
        width: "600px",
        height: "600px",
        position: "relative",  // Ensures the chart is positioned above the background
        backgroundSize: "contain", // Ensures the image fits within the container
        backgroundPosition: "center",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ position: "absolute", top: "10px", left: "10px", color: "white" }}>
        Hertzsprung-Russell Diagram
      </h2>

      {/* Rendering temperature class areas */}
      {temperatureClassAreas.map((area, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${(60000 - area.x.max) / 60000 * 100}%`,  // Calculate the width based on temperature range
            width: `${(area.x.max - area.x.min) / 60000 * 100}%`,
            top: "0",
            bottom: "0",
            backgroundColor: area.color,
            opacity: 0.2,
          }}
        />
      ))}

      {/* Scatter plot for stars */}
      <Scatter data={data} options={options} />
    </div>
  );
}

export default HRDiagram;
