import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/logo.png'; // Relative path to the logo image

export default function NavBar() {
  const location = useLocation(); // Get the current route

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="NutriFit Logo" className="logo-image" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/tracker" className={location.pathname === '/tracker' ? 'active' : ''}>
            Calorie Tracker
          </Link>
        </li>
        <li>
          <Link to="/progress" className={location.pathname === '/progress' ? 'active' : ''}>
            Progress
          </Link>
        </li>
        <li className="navbar-account">
          <Link to="/account" className={location.pathname === '/account' ? 'active' : ''}>
            Account
          </Link>
        </li>
      </ul>
    </nav>
  );
}
