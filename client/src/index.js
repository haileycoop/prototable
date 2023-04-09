import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { app } from "./firebaseConfig";

function Root() {
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (app) {
      setFirebaseReady(true);
    }
  }, []);

  return firebaseReady ? <App /> : <p>Loading...</p>;
}

createRoot(document.getElementById("root")).render(<Root />);
