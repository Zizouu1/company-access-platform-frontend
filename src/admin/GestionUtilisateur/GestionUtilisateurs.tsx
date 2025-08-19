import { useEffect, useState } from "react";
import axios from "axios";
import styles from "/src/admin/change.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [errorMessages, setErrorMessages] = useState<{ [id: string]: string }>(
    {}
  );
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
    role: string;
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
      } catch {
        setErrorMessages((prev) => ({
          ...prev,
          fetch: "Erreur lors de la récupération des utilisateurs.",
        }));
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
    if (searchRole.trim() !== "") {
      if (searchRole === "all") {
        filteredList = users;
      } else {
        filteredList = filteredList.filter((r: User) =>
          r.role.toLowerCase().includes(searchRole.toLowerCase())
        );
      }
    }

    setFiltered(filteredList);
  }, [searchNom, searchId, searchRole, users]);
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
        setErrorMessages((prev) => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      })
      .catch(() => {
        setErrorMessages((prev) => ({
          ...prev,
          [id]: "Erreur lors de la suppression. Veuillez réessayer.",
        }));
      });
  };

  return (
    <div className={styles["Gestion-container"]}>
      <h2 className={styles["Gestion-title"]}>Gestion des utilisateurs</h2>
      <Link to="/admin" className={styles["back-link"]}>
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
        <select
          value={searchRole}
          onChange={(e) => setSearchRole(e.target.value)}
        >
          <option value="all">Tous les rôles</option>
          <option value="security">Security</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
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
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: User, index) => (
              <tr key={index}>
                <td>{r.id}</td>
                <td>{r.username}</td>
                <td>{r.role}</td>
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
                  {errorMessages[r.id] && (
                    <p className={styles["message"]}>{errorMessages[r.id]}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
