import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
function App() {
  {/* <Route index element={<Navigate to="add-contact" replace />} /> */}
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
