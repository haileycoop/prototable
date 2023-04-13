import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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

ReactDOM.render(<Root />, document.getElementById("root"));
