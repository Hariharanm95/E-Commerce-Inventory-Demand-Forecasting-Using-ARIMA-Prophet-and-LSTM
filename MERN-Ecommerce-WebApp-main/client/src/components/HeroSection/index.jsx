import React from "react";
import classes from "./HeroSection.module.scss";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className={classes.heroSection}>
      <div className={classes.heroSection__content}>
        <p className={classes.subTitle}>
          Comfortable & Stylish Running Shoes
        </p>
        <h2>MORE COMFORT.</h2>
        <h2>MORE PERFORMANCE.</h2>
        <h2>MORE STYLE.</h2>
        <small>
          Step into comfort with our latest collection of high-performance shoes,
          designed for everyday wear and active lifestyles.
        </small>
        <Link to="/shop">Shop Now</Link>
      </div>
    </div>
  );
};

export default HeroSection;
