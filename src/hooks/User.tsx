import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      setUser(JSON.parse(authData));
    }
  }, []);

  return user;
};
