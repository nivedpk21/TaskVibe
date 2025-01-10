import { clearAuthData, getAuthData } from "../utils/auth";
import "./navigation.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navigation() {
  const navigate = useNavigate();
  const { role } = getAuthData();

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };
  return (
    <>
      <nav className="navbar bg-body-light navbar-expand-lg  shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand p-0 m-0" href="#">
            <img
              src="/public/taskvibepnglogo.png"
              alt="TaskVibe"
              width={130}
              // height={24}
            />
          </a>

          {/* <NavLink className="navbar-brand" to="/">
            TaskVibe
            <img
              style={{ width: "20%", height: "auto", padding: "0", margin: "0" }}
              src="/src/assets/Screenshot 2025-01-10 115005.png"
              className="img-fluid rounded-top"
              alt="logo"
            />
          </NavLink> */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                TaskVibe
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-center flex-grow-1 pe-3 align-items-center">
                {role === "user" ? (
                  <>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/user/dashboard">
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/user/profile">
                        Profile
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/user/wallet">
                        Wallet
                      </NavLink>
                    </li>
                    <li className="nav-item dropdown me-3">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Earn
                      </a>
                      <ul className="dropdown-menu rounded-0 border-0 shadow">
                        <li>
                          <NavLink className="dropdown-item" to="/earn/urlshortner">
                            Url Shortner
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown me-3">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Advertise
                      </a>
                      <ul className="dropdown-menu rounded-0 border-0 shadow">
                        <li>
                          <NavLink className="dropdown-item" to="/add/urlshortner">
                            Url Shortner
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/tasklog">
                        Task log
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/contact">
                        Contact
                      </NavLink>
                    </li>
                    <div>
                      <button onClick={handleLogout} type="button" className="btn btn-primary">
                        LogOut
                      </button>
                    </div>
                  </>
                ) : role === "admin" ? (
                  <>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/admin/dashboard">
                        Dashboard
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/user/wallet">
                        Wallet
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/user/profile">
                        Profile
                      </NavLink>
                    </li>
                    <li className="nav-item dropdown me-3">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Earn
                      </a>
                      <ul className="dropdown-menu rounded-0 border-0 shadow">
                        <li>
                          <NavLink className="dropdown-item" to="/earn/urlshortner">
                            Url Shortner
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item dropdown me-3">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Advertise
                      </a>
                      <ul className="dropdown-menu rounded-0 border-0 shadow">
                        <li>
                          <NavLink className="dropdown-item" to="/add/urlshortner">
                            Url Shortner
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/tasklog">
                        Task log
                      </NavLink>
                    </li>

                    <li className="nav-item dropdown me-3">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Manage Tasks
                      </a>
                      <ul className="dropdown-menu rounded-0 border-0 shadow">
                        <li>
                          <NavLink className="dropdown-item" to="/add/urlshortner">
                            Manage ShortUrl
                          </NavLink>
                        </li>
                      </ul>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/admin/userlist">
                        Manage Users
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/admin/message">
                        Messages
                      </NavLink>
                    </li>
                    <div>
                      <button onClick={handleLogout} type="button" className="btn btn-primary">
                        LogOut
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" aria-current="page" to="/">
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/signin">
                        Signin
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/signup">
                        Signup
                      </NavLink>
                    </li>
                    <li className="nav-item me-3">
                      <NavLink className="nav-link" to="/contact">
                        Contact
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
