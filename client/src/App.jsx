import { BrowserRouter, Routes, Route } from "react-router-dom";
import Graph from "./components/Graph";
import Home from "./pages/Home";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="visual" element={<Graph />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
