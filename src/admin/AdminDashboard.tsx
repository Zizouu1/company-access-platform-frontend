import Logout from "../login/Logout";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const UserM = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/GestionUtilisateurs", { state: { token: parsedAuth.token } });
    }
  };

  const EmployeeM = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/GestionSalaries", { state: { token: parsedAuth.token } });
    }
  };

  const UpdateDelete = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/ModifierSupprimer", { state: { token: parsedAuth.token } });
    }
  };
  return (
    <div>
      <button onClick={UserM}>Gestion des utilisateurs</button>
      <button onClick={EmployeeM}>Gestion des salaries</button>
      <button onClick={UpdateDelete}>Modifier ou supprimer</button>
      <Logout />
    </div>
  );
}
