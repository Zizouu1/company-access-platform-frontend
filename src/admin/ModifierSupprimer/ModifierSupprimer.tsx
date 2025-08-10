import { useNavigate } from "react-router-dom";
import Logout from "../../login/Logout";

export default function ModifierSupprimer() {
  const navigate = useNavigate();

  const Visiteur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierVisiteur", { state: { token: parsedAuth.token } });
    }
  };

  const Administrateur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierAdministrateur", {
        state: { token: parsedAuth.token },
      });
    }
  };

  const Retard = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/modifierRetard", { state: { token: parsedAuth.token } });
    }
  };

  return (
    <div>
      <button onClick={Visiteur}>Visiteur</button>
      <button onClick={Administrateur}>Suivi Administrateur</button>
      <button onClick={Retard}>Retard</button>
      <Logout />
    </div>
  );
}
