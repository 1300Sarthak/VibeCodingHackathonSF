import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GovernmentServicePage from "@/polymet/pages/government-service";

export default function GovernmentServicePrototype() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GovernmentServicePage />} />

        <Route path="/government-service" element={<GovernmentServicePage />} />
      </Routes>
    </Router>
  );
}
