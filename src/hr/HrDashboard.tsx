import { useNavigate } from "react-router-dom";

export default function HrDashboard() {
  const navigate = useNavigate();

  const Visiteur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/visiteurTable", { state: { token: parsedAuth.token } });
    }
  };

  const Administrateur = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/administrateurTable", { state: { token: parsedAuth.token } });
    }
  };

  const Retard = () => {
    const auth = localStorage.getItem("auth");
    if (auth !== null) {
      const parsedAuth = JSON.parse(auth);
      navigate("/retardTable", { state: { token: parsedAuth.token } });
    }
  };

  return (
    <div>
      <button onClick={Visiteur}>Visiteur</button>
      <button onClick={Administrateur}>Suivi Administrateur</button>
      <button onClick={Retard}>Retard</button>
    </div>
  );
}
