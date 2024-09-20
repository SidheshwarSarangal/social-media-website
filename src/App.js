import "./App.css";
import {Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Routes>
        <route>
          <Route path="/" element={<Home/>} />
        </route>
      </Routes>
    </div>
  );
}

export default App;
