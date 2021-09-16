import React from "react";
import "./Navbar.scss";

export class Navbar extends React.Component<any, any> {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light" id="navbar">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <img
            className="navbar__logo"
            src={process.env.PUBLIC_URL + "/images/logo_cslabs.png"}
            alt="CSLabs Logo"
          />
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <span className="nav-link">Accueil</span>
              </li>
              <li className="nav-item">
                <span className="nav-link">Information</span>
              </li>
            </ul>
            <form className="me-auto d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Sujet..."
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Rechercher
              </button>
            </form>
            <ul className="navbar-nav me-4 mb-2 mb-lg-0">
              <li className="nav-item">
                <span className="nav-link">Connexion</span>
              </li>
              <li className="nav-item">
                <span className="nav-link">Inscription</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
