import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import PrivateRoute from "./login/PrivateRoute";
import SecurityDashboard from "./security/SecurityDashboard";
import HRDashboard from "./hr/HrDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import Visiteur from "./security/Visiteur";
import Retard from "./security/Retard";
import Administrateur from "./security/Administrateur";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute role="security" />}>
          <Route path="/security" element={<SecurityDashboard />} />
          <Route path="/visiteur" element={<Visiteur />} />
          <Route path="/retard" element={<Retard />} />
          <Route path="/administrateur" element={<Administrateur />} />
        </Route>
        <Route element={<PrivateRoute role="hr" />}>
          <Route path="/hr" element={<HRDashboard />} />
        </Route>
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
