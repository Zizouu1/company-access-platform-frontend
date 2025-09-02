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
import Layout from "./security/LayoutS";
import LayoutH from "./hr/LayoutH";
import LayoutA from "./admin/LayoutA";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute role="security" />}>
          <Route
            path="/security"
            element={
              <Layout>
                {" "}
                <SecurityDashboard />
              </Layout>
            }
          />
          <Route
            path="/visiteur"
            element={
              <Layout>
                {" "}
                <Visiteur />
              </Layout>
            }
          />
          <Route
            path="/retard"
            element={
              <Layout>
                {" "}
                <Retard />
              </Layout>
            }
          />
          <Route
            path="/administrateur"
            element={
              <Layout>
                {" "}
                <Administrateur />
              </Layout>
            }
          />
        </Route>
        <Route element={<PrivateRoute role="hr" />}>
          <Route
            path="/hr"
            element={
              <LayoutH>
                {""}
                <HRDashboard />
              </LayoutH>
            }
          />
          <Route
            path="/visiteurTable"
            element={
              <LayoutH>
                {""}
                <VisiteurTable />
              </LayoutH>
            }
          />
          <Route
            path="/retardTable"
            element={
              <LayoutH>
                {""}
                <RetardTable />
              </LayoutH>
            }
          />
          <Route
            path="/administrateurTable"
            element={
              <LayoutH>
                {""}
                <AdministrateurTable />
              </LayoutH>
            }
          />
        </Route>
        <Route element={<PrivateRoute role="admin" />}>
          <Route
            path="/admin"
            element={
              <LayoutA>
                {""} <AdminDashboard />{" "}
              </LayoutA>
            }
          />
          <Route
            path="/GestionUtilisateurs"
            element={
              <LayoutA>
                {""} <GestionUtilisateurs />
              </LayoutA>
            }
          />
          <Route
            path="/GestionSalaries"
            element={
              <LayoutA>
                {""} <GestionSalaries />
              </LayoutA>
            }
          />
          <Route
            path="/AjouterUtilisateur"
            element={
              <LayoutA>
                {""} <AddUser />
              </LayoutA>
            }
          />
          <Route
            path="/ModifierUtilisateur/:id"
            element={
              <LayoutA>
                {""} <UpdateUser />
              </LayoutA>
            }
          />
          <Route
            path="/AjouterSalaries"
            element={
              <LayoutA>
                {""} <AddSalarie />
              </LayoutA>
            }
          />
          <Route
            path="/ModifierSalarie/:id"
            element={
              <LayoutA>
                {""} <UpdateSalarie />
              </LayoutA>
            }
          />
          <Route
            path="/modifierSupprimerVisiteur"
            element={
              <LayoutA>
                {""} <VisitorAdmin />
              </LayoutA>
            }
          />
          <Route
            path="/modifierSupprimerAdministrateur"
            element={
              <LayoutA>
                {""} <AdministrateurAdmin />
              </LayoutA>
            }
          />
          <Route
            path="/modifierSupprimerRetard"
            element={
              <LayoutA>
                {""} <DelayAdmin />
              </LayoutA>
            }
          />
          <Route
            path="/UpdateVisitor/:id"
            element={
              <LayoutA>
                {""} <UpdateVisitor />
              </LayoutA>
            }
          />
          <Route
            path="/UpdateDelay/:id"
            element={
              <LayoutA>
                {""} <UpdateDelay />
              </LayoutA>
            }
          />
          <Route
            path="/UpdateAdministrateur/:id"
            element={
              <LayoutA>
                {""} <UpdateAdministrateur />
              </LayoutA>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
