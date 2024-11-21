
import React from "react";

function StarClassificationResults({ results }) {
  return (
    <div>
      <h2>Star Classification Results</h2>
      <p>Lifecycle Stage: {results.lifecycleStage}</p>
      <p>Luminosity Classification: {results.luminosityClassification}</p>
      <p>Spectral Type: {results.spectralType}</p>
    </div>
  );
}

export default StarClassificationResults;
