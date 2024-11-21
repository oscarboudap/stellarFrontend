import React, { useState } from "react";
import StarSimulation from "./components/StarSimulation";
import LightCurve from "./components/LightCurve";
import StarParameters from "./components/StarParameters";
import HRDiagram from "./components/HRDiagram";
import axios from "axios";

// Import Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  LogarithmicScale,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LogarithmicScale,LinearScale, CategoryScale, Title, Tooltip, Legend);

function App() {
  const [mass, setMass] = useState(1.0);
  const [temperature, setTemperature] = useState(5000);
  const [luminosity, setLuminosity] = useState(1.0);
  const [radius, setRadius] = useState(1.0);
  const [state, setState] = useState("stable");
  const [lightCurveData, setLightCurveData] = useState({ labels: [], datasets: [] });
  const [results, setResults] = useState({
    lifecycleStage: "Unknown",
    luminosityClassification: "Unknown",
    spectralType: "Unknown",
    chromaticity: "Unknown",
    hydrogenLines: "Unknown",
  });
  const [hrData, setHRData] = useState([]);
  const [highlightedClass, setHighlightedClass] = useState(null); // To track the highlighted class

  // Classify star based on temperature, mass, and luminosity
  const classifyStar = (temperature, mass, luminosity) => {
    let starClass = "";

    // Spectral classification based on temperature
    if (temperature >= 33000) {
      starClass = "O-type (Blue)";
    } else if (temperature >= 10000) {
      starClass = "B-type (Bluish White)";
    } else if (temperature >= 7300) {
      starClass = "A-type (White)";
    } else if (temperature >= 6000) {
      starClass = "F-type (Yellowish White)";
    } else if (temperature >= 5300) {
      starClass = "G-type (Yellow)";
    } else if (temperature >= 3900) {
      starClass = "K-type (Light Orange)";
    } else {
      starClass = "M-type (Red)";
    }

    // Highlight the corresponding class
    setHighlightedClass(starClass);

    return starClass;
  };

  // Classify lifecycle stage based on mass
  const classifyLifecycleStage = (mass) => {
    if (mass < 0.5) return "Proto-Star";
    if (mass < 1.4) return "Main Sequence Star";
    if (mass >= 1.4 && mass < 8) return "Red Giant or Supergiant";
    if (mass >= 8) return "Final Stage (Neutron Star or Black Hole)";
    return "Unknown Stage";
  };

  // Classify luminosity and temperature based on the provided data
  const classifyLuminosityTemperature = (luminosity, temperature) => {
    if (luminosity < 0.1) return "White Dwarf";
    if (luminosity < 1) return "Sub-Dwarf";
    if (luminosity < 10) return "Main Sequence Star";
    if (luminosity < 100) return "Giant Star";
    if (luminosity < 1000) return "Supergiant Star";
    return "Hypergiant Star";
  };

  // Placeholder for chromaticity and hydrogen line strength (could be expanded with more detailed data)
  const classifyChromaticity = (temperature) => {
    if (temperature > 30000) return "Blue";
    if (temperature > 10000) return "Bluish White";
    if (temperature > 7500) return "White";
    if (temperature > 6000) return "Yellowish White";
    if (temperature > 5200) return "Yellow";
    if (temperature > 3700) return "Orange-Yellow";
    return "Red";
  };

  const classifyHydrogenLines = (temperature) => {
    if (temperature > 10000) return "Strong";
    if (temperature > 5000) return "Medium";
    return "Weak";
  };

  const runSimulation = () => {
    axios
      .post("http://127.0.0.1:5000/simulate", { mass, temperature, luminosity, radius })
      .then((response) => {
        const { state, light_curve } = response.data;

        setState(state);

        setLightCurveData({
          labels: light_curve.time,
          datasets: [
            {
              label: "Luminosity",
              data: light_curve.luminosity,
              borderColor: "orange",
              borderWidth: 2,
            },
          ],
        });

        // Update classification results
        const starClass = classifyStar(temperature, mass, luminosity);
        const chromaticity = classifyChromaticity(temperature);
        const hydrogenLines = classifyHydrogenLines(temperature);

        setResults({
          lifecycleStage: classifyLifecycleStage(mass),
          luminosityClassification: classifyLuminosityTemperature(luminosity, temperature),
          spectralType: starClass,
          chromaticity: chromaticity,
          hydrogenLines: hydrogenLines,
        });

        // Prepare HR Data
        const newHRData = [
          { x: temperature, y: luminosity }, // Example star position
        ];
        setHRData(newHRData);
        
      })
      .catch((error) => console.error("Error running simulation:", error));
  };

  return (
    <div className="App">
      <h1>Supernova Simulation</h1>
      <StarParameters
        mass={mass}
        setMass={setMass}
        temperature={temperature}
        setTemperature={setTemperature}
        luminosity={luminosity}
        setLuminosity={setLuminosity}
        radius={radius}
        setRadius={setRadius}
        runSimulation={runSimulation}
      />
      <StarSimulation state={state} temperature={temperature} />
      <div>
        <h2>Star Classification Results</h2>
        <p>Lifecycle Stage: {results.lifecycleStage}</p>
        <p>Luminosity Classification: {results.luminosityClassification}</p>
        <p>Spectral Type: {results.spectralType}</p>
        <p>Chromaticity: {results.chromaticity}</p>
        <p>Hydrogen Lines: {results.hydrogenLines}</p>
        <h3>Star Classification Table</h3>
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Effective Temperature</th>
              <th>Chromaticity</th>
              <th>Main-Sequence Mass</th>
              <th>Main-Sequence Radius</th>
              <th>Main-Sequence Luminosity</th>
              <th>Hydrogen Lines</th>
              <th>Fraction of Stars</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: highlightedClass === "O-type (Blue)" ? "yellow" : "" }}>
              <td>O</td>
              <td>≥ 33,000 K</td>
              <td>blue</td>
              <td>≥ 16 M☉</td>
              <td>≥ 6.6 R☉</td>
              <td>≥ 30,000 L☉</td>
              <td>Weak</td>
              <td>0.00003%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "B-type (Bluish White)" ? "yellow" : "" }}>
              <td>B</td>
              <td>10,000–33,000 K</td>
              <td>bluish white</td>
              <td>2.1–16 M☉</td>
              <td>1.8–6.6 R☉</td>
              <td>25–30,000 L☉</td>
              <td>Medium</td>
              <td>0.12%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "A-type (White)" ? "yellow" : "" }}>
              <td>A</td>
              <td>7,300–10,000 K</td>
              <td>white</td>
              <td>1.4–2.1 M☉</td>
              <td>1.4–1.8 R☉</td>
              <td>5–25 L☉</td>
              <td>Strong</td>
              <td>0.61%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "F-type (Yellowish White)" ? "yellow" : "" }}>
              <td>F</td>
              <td>6,000–7,300 K</td>
              <td>yellowish white</td>
              <td>1.04–1.4 M☉</td>
              <td>1.15–1.4 R☉</td>
              <td>1.5–5 L☉</td>
              <td>Medium</td>
              <td>3.0%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "G-type (Yellow)" ? "yellow" : "" }}>
              <td>G</td>
              <td>5,300–6,000 K</td>
              <td>yellow</td>
              <td>0.8–1.04 M☉</td>
              <td>0.96–1.15 R☉</td>
              <td>0.6–1.5 L☉</td>
              <td>Weak</td>
              <td>7.6%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "K-type (Light Orange)" ? "yellow" : "" }}>
              <td>K</td>
              <td>3,900–5,300 K</td>
              <td>light orange</td>
              <td>0.45–0.8 M☉</td>
              <td>0.7–0.96 R☉</td>
              <td>0.08–0.6 L☉</td>
              <td>Very weak</td>
              <td>12%</td>
            </tr>
            <tr style={{ backgroundColor: highlightedClass === "M-type (Red)" ? "yellow" : "" }}>
              <td>M</td>
              <td>2,300–3,900 K</td>
              <td>Light orangish red</td>
              <td>0.08–0.45 M☉</td>
              <td>≤ 0.7 R☉</td>
              <td>≤ 0.08 L☉</td>
              <td>Very weak</td>
              <td>76%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <LightCurve lightCurveData={lightCurveData} />
      <HRDiagram starData={hrData} />
    </div>
  );
}

export default App;
