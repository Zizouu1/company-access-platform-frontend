import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Gestion.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  interface User {
    id: string;
    username: string;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin",
          },
        });
        setUsers(res.data);
        setFiltered(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    let filteredList = [...users];

    if (searchNom.trim() !== "") {
      filteredList = filteredList.filter((r: User) =>
        r.username.toLowerCase().includes(searchNom.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((r: User) =>
        r.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    setFiltered(filteredList);
  }, [searchNom, searchId, users]);
  const handleAddUser = () => {
    navigate("/AjouterUtilisateur", { state: { token } });
  };
  const handleEdit = (id: string) => {
    navigate(`/ModifierUtilisateur/${id}`, { state: { token } });
  };
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.filter((user: User) => user.id !== id)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((user: User) => user.id !== id)
        );
      })
      .catch(() => {
        setMessage(
          "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer."
        );
      });
  };

  return (
    <div className={styles["Gestion-container"]}>
      <h2 className={styles["Gestion-title"]}>Gestion des utilisateurs</h2>
      <Link to="/hr" className={styles["back-link"]}>
        Retour
      </Link>

      <div className={styles["filters"]}>
        <input
          type="text"
          placeholder="Nom"
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Matricule"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
      </div>

      <button className={styles["add-button"]} onClick={handleAddUser}>
        Ajouter un utilisateur
      </button>

      <div className={styles["table-container"]}>
        <table className={styles["Gestion-table"]}>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: User, index) => (
              <tr key={index}>
                <td>{r.id}</td>
                <td>{r.username}</td>
                <td>
                  <button
                    className={styles["delete-button"]}
                    onClick={() => handleDelete(r.id)}
                  >
                    Supprimer
                  </button>
                </td>
                <td>
                  <button
                    className={styles["edit-button"]}
                    onClick={() => handleEdit(r.id)}
                  >
                    Modifier
                  </button>
                </td>
                <td>
                  {message && <p className={styles["message"]}>{message}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
