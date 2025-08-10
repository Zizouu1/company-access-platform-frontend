import { Navigate, Outlet } from "react-router-dom";

const getauth = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : null;
};

export default function PrivateRoute({ role }: { role: string }) {
  const auth = getauth();

  return !auth?.token ? (
    <Navigate to="/" replace />
  ) : role && auth.role !== role ? (
    <Navigate to="/" replace />
  ) : (
    <Outlet />
  );
}
