import React from "react";
import { FaUndo, FaTruck } from "react-icons/fa";
import { BsStars, BsShieldCheck } from "react-icons/bs";
import "../../pages/home/HomePage.css"

const TrustBar = () => (
  <div className="trust-bar-container">
    <div className="trust-bar">
      <div className="trust-item"><FaUndo className="trust-icon" /> 30 Days Money-Back</div>
      <div className="trust-item"><BsShieldCheck className="trust-icon" /> 3 Years Warranty</div>
      <div className="trust-item"><FaTruck className="trust-icon" /> Free Shipping</div>
      <div className="trust-item"><BsStars className="trust-icon" /> Best Service</div>
    </div>
  </div>
);

export default TrustBar;
