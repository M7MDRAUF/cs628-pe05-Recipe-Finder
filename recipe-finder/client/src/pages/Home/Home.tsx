import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

/* ── Inline SVG icons (no emoji, no extra dependency) ──────── */
const IconList = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
  </svg>
);
const IconAdd = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export function Home() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover & Manage Your <span className={styles.accent}>Favourite Recipes</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Store, search, and share delicious recipes. Add ingredients, write
            step-by-step instructions, and keep your culinary ideas organised in
            one place.
          </p>
          <div className={styles.heroActions}>
            <Link to="/recipes" className={styles.primaryBtn}>
              Browse Recipes
            </Link>
            <Link to="/recipes/add" className={styles.secondaryBtn}>
              + Add Recipe
            </Link>
          </div>
        </div>

        {/* Hero illustration — CSS only, no emoji */}
        <div className={styles.heroIllustration} aria-hidden="true">
          <div className={styles.heroBadge}>RF</div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className={styles.features}>
        {[
          { icon: <IconList />, title: "Recipe List",    desc: "Browse all your saved recipes in a beautiful responsive grid." },
          { icon: <IconAdd />,  title: "Add Recipes",    desc: "Fill in the name, ingredients, and step-by-step instructions." },
          { icon: <IconSearch />, title: "Search & Filter", desc: "Find the perfect recipe by name, ingredient, or category." },
          { icon: <IconEdit />, title: "Edit & Delete",  desc: "Keep your collection up to date with full CRUD support." },
        ].map(({ icon, title, desc }) => (
          <div key={title} className={styles.featureCard}>
            <span className={styles.featureIcon}>{icon}</span>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
