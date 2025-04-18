import { BrowserRouter, Routes, Route } from "react-router-dom";
import Graph from "./components/Graph";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/visual" element={<Graph />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
