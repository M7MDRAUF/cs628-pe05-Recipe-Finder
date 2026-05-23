/**
 * src/components/Navbar/Navbar.tsx
 * -------------------------------------------------------
 * Responsive navigation bar with mobile hamburger menu.
 * Uses React Router NavLink for active-link highlighting.
 * -------------------------------------------------------
 */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu  = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand / Logo */}
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              {/* Fork + knife silhouette */}
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
            </svg>
          </span>
          <span className={styles.brandText}>Recipe Finder</span>
        </NavLink>

        {/* Hamburger button (mobile) */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav links */}
        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          role="navigation"
          aria-label="Main navigation"
        >
          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
            onClick={closeMenu}
          >
            All Recipes
          </NavLink>

          <NavLink
            to="/recipes/add"
            className={({ isActive }) =>
              `${styles.link} ${styles.addBtn} ${isActive ? styles.active : ""}`
            }
            onClick={closeMenu}
          >
            + Add Recipe
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
