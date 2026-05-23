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
          <span className={styles.brandIcon}>🍽️</span>
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
