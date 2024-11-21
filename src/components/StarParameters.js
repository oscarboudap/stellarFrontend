import React from "react";

function StarParameters({ mass, setMass, temperature, setTemperature, luminosity, setLuminosity, runSimulation }) {
  return (
    <div>
      <h2>Star Parameters</h2>
      <label>
        Mass (Solar Masses):
        <input
          type="number"
          value={mass}
          onChange={(e) => setMass(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Temperature (Kelvin):
        <input
          type="number"
          value={temperature}
          onChange={(e) => setTemperature(parseInt(e.target.value))}
        />
      </label>
      <label>
        Luminosity (Solar Luminosities):
        <input
          type="number"
          value={luminosity}
          onChange={(e) => setLuminosity(parseFloat(e.target.value))}
        />
      </label>
      <button onClick={runSimulation}>Run Simulation</button>
    </div>
  );
}

export default StarParameters;
