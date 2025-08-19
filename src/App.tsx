import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login/Login";
import PrivateRoute from "./login/PrivateRoute";
import SecurityDashboard from "./security/SecurityDashboard";
import HRDashboard from "./hr/HrDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import Visiteur from "./security/Visiteur";
import Retard from "./security/Retard";
import Administrateur from "./security/Administrateur";
import RetardTable from "./hr/RetardTable";
import AdministrateurTable from "./hr/AdministrateurTable";
import VisiteurTable from "./hr/VisiteurTable";
import ModifierSupprimer from "./admin/ModifierSupprimer/ModifierSupprimer";
import GestionUtilisateurs from "./admin/GestionUtilisateur/GestionUtilisateurs";
import GestionSalaries from "./admin/GestionSalarie/GestionSalaries";
import AddUser from "./admin/GestionUtilisateur/AddUser";
import UpdateUser from "./admin/GestionUtilisateur/UpdateUser";
import AddSalarie from "./admin/GestionSalarie/AddSalarie";
import UpdateSalarie from "./admin/GestionSalarie/UpdateSalarie";
import VisitorAdmin from "./admin/ModifierSupprimer/VisitorAdmin";
import DelayAdmin from "./admin/ModifierSupprimer/DelayAdmin";
import AdministrateurAdmin from "./admin/ModifierSupprimer/AdministratorAdmin";
import UpdateVisitor from "./admin/ModifierSupprimer/UpdateVisitor";
import UpdateAdministrateur from "./admin/ModifierSupprimer/UpdateAdministrator";
import UpdateDelay from "./admin/ModifierSupprimer/UpdateDelay";

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
          <Route path="/visiteurTable" element={<VisiteurTable />} />
          <Route path="/retardTable" element={<RetardTable />} />
          <Route
            path="/administrateurTable"
            element={<AdministrateurTable />}
          />
        </Route>
        <Route element={<PrivateRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/ModifierSupprimer" element={<ModifierSupprimer />} />
          <Route
            path="/GestionUtilisateurs"
            element={<GestionUtilisateurs />}
          />
          <Route path="/GestionSalaries" element={<GestionSalaries />} />
          <Route path="/AjouterUtilisateur" element={<AddUser />} />
          <Route path="/ModifierUtilisateur/:id" element={<UpdateUser />} />
          <Route path="/AjouterSalaries" element={<AddSalarie />} />
          <Route path="/ModifierSalarie/:id" element={<UpdateSalarie />} />
          <Route path="/modifierSupprimerVisiteur" element={<VisitorAdmin />} />
          <Route
            path="/modifierSupprimerAdministrateur"
            element={<AdministrateurAdmin />}
          />
          <Route path="/modifierSupprimerRetard" element={<DelayAdmin />} />
          <Route path="/UpdateVisitor/:id" element={<UpdateVisitor />} />
          <Route path="/UpdateDelay/:id" element={<UpdateDelay />} />
          <Route
            path="/UpdateAdministrateur/:id"
            element={<UpdateAdministrateur />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
