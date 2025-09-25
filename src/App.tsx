import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sd4 from "./pages/Sd4";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sd4 />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
