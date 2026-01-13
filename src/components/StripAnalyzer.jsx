import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";

export default function StripAnalyzer() {
  const [model, setModel] = useState(null);
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  // Load TFJS model
  const loadModel = async () => {
    const loadedModel = await tf.loadGraphModel(
  "/models/tfjs_graph_model/model.json",
  { cache: false }
);
setModel(loadedModel);
alert("Model loaded successfully");
  };

  // Handle image upload
  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // Run prediction
  const analyze = async () => {
  if (!model || !image) {
    alert("Please load model and upload image");
    return;
  }

  const img = new Image();
  img.src = URL.createObjectURL(image);

  img.onload = async () => {
    const tensor = tf.browser
      .fromPixels(img)
      .resizeNearestNeighbor([96, 96])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    const pred = await model.executeAsync(tensor);
    const value = pred.dataSync()[0];

    if (value >= 0.7) {
      setResult(`POSITIVE (High risk) — ${value.toFixed(3)}`);
    } else if (value >= 0.4) {
      setResult(`UNCERTAIN (Medium risk) — ${value.toFixed(3)}`);
    } else {
      setResult(`NEGATIVE (Low risk) — ${value.toFixed(3)}`);
    }

    tf.dispose([tensor, pred]); // 🔥 important
  };
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Sweat Strip Analyzer</h2>

      <button onClick={loadModel}>Load Model</button>
      <br /><br />

      <input type="file" accept="image/*" onChange={handleImage} />
      <br /><br />

      <button onClick={analyze}>Analyze</button>

      <h3>{result}</h3>
    </div>
  );
}
