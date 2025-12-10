import React from "react";
import "../../pages/home/HomePage.css";

const HeroBanner = () => (
  <section className="hero-container">
    <h2 className="hero-title">Welcome to Luna 👋</h2>
    <div className="hero-banners">
      <div className="banner-side">
        <img
          className="banner-img"
          src="https://i.pinimg.com/736x/0f/89/fa/0f89fae42a25bf07ac2e2b344348d1d5.jpg"
          alt="1"
        />
      </div>
      <div className="banner-center">
        <img
          className="banner-img"
          src="https://i.pinimg.com/1200x/a9/9c/dd/a99cdd8a5424102bd48ca50e8c42e9d0.jpg"
        />
      </div>
      <div className="banner-side">
        <img
          className="banner-img1"
          src="https://i.pinimg.com/736x/31/bb/23/31bb2321865e4e4baced7465eac6d8c0.jpg"
          alt="3"
        />
      </div>
    </div>
  </section>
);

export default HeroBanner;
