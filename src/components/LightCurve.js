import React from "react";
import { Line } from "react-chartjs-2";

function LightCurve({ lightCurveData }) {
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (days)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Apparent Magnitude",
        },
        reverse: true, // Magnitudes are reversed (lower values = brighter)
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div>
      <h2>Light Curve</h2>
      {lightCurveData.labels.length > 0 ? (
        <Line data={lightCurveData} options={options} />
      ) : (
        <p>No data available for the light curve.</p>
      )}
    </div>
  );
}

export default LightCurve;
