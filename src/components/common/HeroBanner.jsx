import React from "react";
import "../../pages/home/HomePage.css"

const HeroBanner = () => (
  <section className="hero-container">
    <h2 className="hero-title">Welcome to Luna 👋</h2>
    <div className="hero-banners">
      <div className="banner-side">
        <img className="banner-img" src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" alt="1" />
      </div>
      <div className="banner-center">
        <img className="banner-img" src="https://thumbs.static-thomann.de/thumb/thumb1000x/pics/cms/image/teasertool/en/17066/cyber_week_banner_2025_en.webp" />
      </div>
      <div className="banner-side">
        <img className="banner-img" src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop" alt="3" />
      </div>
    </div>
  </section>
);

export default HeroBanner;
