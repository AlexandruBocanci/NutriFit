import "./NavBar.css";
import logo from "../assets/logo.png"; // Calea relativă către imagine

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/">
          <img src={logo} alt="NutriFit Logo" className="logo-image" />
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/tracker">Calorie Tracker</a>
        </li>
        <li>
          <a href="/progress">Progress</a>
        </li>
        <li className="navbar-account">
          <a href="/account">Account</a>
        </li>
      </ul>
    </nav>
  );
}
