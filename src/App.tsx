import React from "react";
import "./App.scss";
import Cards from "./CardManager/Cards/Cards";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Cards />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
