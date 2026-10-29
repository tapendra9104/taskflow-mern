import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">TaskFlow</div>

      <div className="navbar-user">
        <div className="navbar-user-info">
          <div className="navbar-user-name">{user?.name}</div>
          <div className="navbar-user-email">{user?.email}</div>
        </div>
        <div className="navbar-avatar" title={user?.name}>
          {initials}
        </div>
        <button
          className="btn btn-ghost navbar-logout"
          onClick={handleLogout}
          id="logout-btn"
        >
          ⎋ Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
