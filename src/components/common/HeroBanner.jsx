import React from "react";
import "../../pages/home/HomePage.css"

const HeroBanner = () => (
  <section className="hero-container">
    <h2 className="hero-title">Welcome to Luna 👋</h2>
    <div className="hero-banners">
      <div className="banner-side">
        <img className="banner-img" src="https://i.pinimg.com/736x/0f/89/fa/0f89fae42a25bf07ac2e2b344348d1d5.jpg" alt="1" />
      </div>
      <div className="banner-center">
        <img className="banner-img" src="https://i.pinimg.com/736x/ef/80/b0/ef80b005c606aeacf0cd8e2877b7e09a.jpg" />
      </div>
      <div className="banner-side">
        <img className="banner-img1" src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop" alt="3" />
      </div>
    </div>
  </section>
);

export default HeroBanner;
