import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Table.module.css";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function VisitorTable() {
  const [visitors, setVisitors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchId, setsearchId] = useState("");
  const [searchMatriculeV, setsearchMatriculeV] = useState("");
  const [searchTypeV, setsearchTypeV] = useState("");
  const [searchAQui, setsearchAQui] = useState("");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const token = location.state?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  interface Visitor {
    id: string;
    fullname: string;
    matriculeV: string;
    typeV: string;
    aQui: string;
    dateA: string;
    time: string;
  }

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await axios.get("http://localhost:3000/visitor-manager", {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin",
          },
        });
        const visitorsWithDates = res.data.map((v: Visitor) => ({
          ...v,
          date: new Date(v.dateA),
        }));

        setVisitors(visitorsWithDates);
        setFiltered(visitorsWithDates);
      } catch (error) {
        console.error("Error fetching visitors:", error);
      }
    };

    fetchVisitors();
  }, [token]);

  useEffect(() => {
    let filteredList = [...visitors];

    if (searchName.trim() !== "") {
      filteredList = filteredList.filter((v: Visitor) =>
        v.fullname.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchId.trim() !== "") {
      filteredList = filteredList.filter((v: Visitor) =>
        v.id.toLowerCase().includes(searchId.toLowerCase())
      );
    }
    if (searchMatriculeV.trim() !== "") {
      filteredList = filteredList.filter((v: Visitor) =>
        v.matriculeV.toLowerCase().includes(searchMatriculeV.toLowerCase())
      );
    }
    if (searchTypeV.trim() !== "") {
      filteredList = filteredList.filter((v: Visitor) =>
        v.typeV.toLowerCase().includes(searchTypeV.toLowerCase())
      );
    }
    if (searchAQui.trim() !== "") {
      filteredList = filteredList.filter((v: Visitor) =>
        v.aQui.toLowerCase().includes(searchAQui.toLowerCase())
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filteredList = filteredList.filter((v: Visitor) => {
        const timeIn = new Date(`${v.dateA}T${v.time}`);
        return timeIn >= start && timeIn <= end;
      });
    }

    setFiltered(filteredList);
  }, [
    searchName,
    startDate,
    endDate,
    searchId,
    searchMatriculeV,
    searchTypeV,
    searchAQui,
    visitors,
  ]);

  const handleEdit = (id: string) => {
    navigate(`/ModifierVisitor/${id}`, { state: { token } });
  };
  const handleDelete = (id: string) => {
    axios
      .delete(`http://localhost:3000/visitor-manager/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin",
        },
      })
      .then(() => {
        setVisitors((prevVisitors) =>
          prevVisitors.filter((visitor: Visitor) => visitor.id !== id)
        );
        setFiltered((prevFiltered) =>
          prevFiltered.filter((visitor: Visitor) => visitor.id !== id)
        );
      })
      .catch(() => {
        setMessage(
          "Erreur lors de la suppression de l'employee. Veuillez réessayer."
        );
      });
  };

  return (
    <div className={styles["Gestion-container"]}>
      <h2 className={styles["Gestion-title"]}>Liste des visiteurs</h2>
      <Link to="/admin" className={styles["back-link"]}>
        Retour
      </Link>

      <div className={styles["filters"]}>
        <input
          type="text"
          placeholder="Nom et prénom"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Numèro carte d'identité"
          value={searchId}
          onChange={(e) => setsearchId(e.target.value)}
        />
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Matricule voiture"
          value={searchMatriculeV}
          onChange={(e) => setsearchMatriculeV(e.target.value)}
        />
        <input
          type="text"
          placeholder="Type de visite"
          value={searchTypeV}
          onChange={(e) => setsearchTypeV(e.target.value)}
        />
        <input
          type="text"
          placeholder="A qui le visite"
          value={searchAQui}
          onChange={(e) => setsearchAQui(e.target.value)}
        />
      </div>
      <div className={styles["table-container"]}>
        <table className={styles["visitor-table"]}>
          <thead>
            <tr>
              <th>Date d'arrivé</th>
              <th>Heure d'arrivé</th>
              <th>Numèro carte d'identité</th>
              <th>Nom et prénom</th>
              <th>Matricule voiture</th>
              <th>Type de visite</th>
              <th>A qui le visite</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v: Visitor) => (
              <tr key={v.id}>
                <td>{v.dateA}</td>
                <td>{v.time}</td>
                <td>{v.id}</td>
                <td>{v.fullname}</td>
                <td>{v.matriculeV}</td>
                <td>{v.typeV}</td>
                <td>{v.aQui}</td>
                <td>
                  <button
                    className={styles["delete-button"]}
                    onClick={() => handleDelete(v.id)}
                  >
                    Supprimer
                  </button>
                </td>
                <td>
                  <button
                    className={styles["edit-button"]}
                    onClick={() => handleEdit(v.id)}
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
