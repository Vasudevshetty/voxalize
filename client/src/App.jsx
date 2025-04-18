import { Routes, Route } from "react-router-dom";
import Graph from "./components/Graph";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/visual" element={<Graph />} />
    </Routes>
  );
}

export default App;
