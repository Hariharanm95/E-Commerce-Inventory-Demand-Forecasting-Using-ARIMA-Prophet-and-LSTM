import React from "react";
import classes from "./OfferStripe.module.scss";
const OfferStripe = () => {
  return (
    <div className={classes.offerStripe}>
      <div className={classes.holder}>FREE SHIPPING WHEN YOU SPEND MORE THAN ₹5000</div>
    </div>
  );
};

export default OfferStripe;
