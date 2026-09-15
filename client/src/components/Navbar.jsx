import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span>N</span>oted
      </div>
      {user && (
        <div className="navbar-right">
          <span className="navbar-user">{user.name}</span>
          <button className="btn btn-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}
