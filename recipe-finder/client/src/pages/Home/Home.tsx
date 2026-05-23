/**
 * src/pages/Home/Home.tsx
 * -------------------------------------------------------
 * Landing page / hero section for Recipe Finder.
 * Redirects users toward the recipe list.
 * -------------------------------------------------------
 */

import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

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

        {/* Hero illustration */}
        <div className={styles.heroIllustration} aria-hidden="true">
          🍳
        </div>
      </section>

      {/* Feature highlights */}
      <section className={styles.features}>
        {[
          { icon: "📋", title: "Recipe List",    desc: "Browse all your saved recipes in a beautiful responsive grid." },
          { icon: "➕", title: "Add Recipes",    desc: "Fill in the name, ingredients, and step-by-step instructions." },
          { icon: "🔍", title: "Search & Filter", desc: "Find the perfect recipe by name, ingredient, or category." },
          { icon: "✏️", title: "Edit & Delete",  desc: "Keep your collection up to date with full CRUD support." },
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
