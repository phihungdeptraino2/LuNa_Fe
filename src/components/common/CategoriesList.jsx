import React from "react";

import {
  FaGuitar,
  FaDrum,
  FaMicrophone,
  FaHeadphones,
  FaVolumeUp,
} from "react-icons/fa";

import {
  GiGrandPiano,
  GiGuitarBassHead,
  GiViolin,
  GiSaxophone,
} from "react-icons/gi";

import { TbDeviceAudioTape } from "react-icons/tb";
import { Link } from "react-router-dom";

import "../../pages/home/HomePage.css";
import "./CategoriesList.css";

const getCategoryIcon = (name) => {
  const lower = name.toLowerCase();

  if (lower.includes("electric guitar")) return <FaGuitar />;
  if (lower.includes("acoustic guitar")) return <FaGuitar />;
  if (lower.includes("bass guitar")) return <GiGuitarBassHead />;
  if (lower.includes("piano") || lower.includes("keyboards")) return <GiGrandPiano />;
  if (lower.includes("acoustic drums") || lower.includes("electronic drums")) return <FaDrum />;
  if (lower.includes("wind")) return <GiSaxophone />;
  if (lower.includes("bowed")) return <GiViolin />;
  if (lower.includes("studio") || lower.includes("recording")) return <FaMicrophone />;
  if (lower.includes("amplifier") || lower.includes("amp")) return <FaVolumeUp />;
  if (lower.includes("effects")) return <TbDeviceAudioTape />;
  if (lower.includes("accessories")) return <FaHeadphones />;

  return <FaGuitar />;
};

const CategoriesList = ({ CATEGORY_LIST, user }) => {
  // giống Header
  const prefix = user?.roles?.includes("CUSTOMER") ? "/customer" : "";

  return (
    <section className="categories-list-section">
      <h2 className="cat-section-title">Our Categories</h2>

      <div className="categories-grid-container">
        {CATEGORY_LIST.map((cat) => (
          <Link
            key={cat.id}
            to={`${prefix}/category?categoryId=${cat.id}`}
            className="category-list-item-link"
          >
            <div className="category-list-item">
              <div className="cat-img-wrapper icon-wrapper">
                {getCategoryIcon(cat.name)}
              </div>
              <span className="cat-name">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoriesList;
