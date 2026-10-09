import React from "react";
import styles from "./HeaderComponent.module.scss";
import SearchPanel from "../SiteSearch/SearchPanel";

export default function HeaderComponent() {
  return (
    <div>
      <img
        style={{ backgroundColor: "white" }}
        src="/img/main-pattern.svg"
        className={styles.HeaderComponentBackground}
        alt=""
      />
      <div className={styles.HeaderComponent}>
        <div className={styles.layout}>
          <h1>Tallinn Design System</h1>
          <p className={styles.tagline}>
            The central digital experience resource of Tallinn. Guidelines,
            design assets and component libraries for building a consistent and
            accessible digital brand across the city.
          </p>

          <div className={styles.search}>
            <SearchPanel id="home-search" inline keyboardFocusOnly />
          </div>
        </div>
      </div>
    </div>
  );
}
