import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGender } from '../context/GenderContext';
import { ArrowRight } from 'lucide-react';

const GenderSelector = () => {
  const { setGender } = useGender();
  const navigate = useNavigate();

  const handleSelect = (selectedGender) => {
    setGender(selectedGender);
    navigate(`/${selectedGender}`);
  };

  return (
    <section className="section-space container">
      <div className="section-header">
        <h2 className="section-title">SHOP BY GENDER</h2>
      </div>

      <div className="gender-cards-grid">
        {/* MEN CARD */}
        <div
          onClick={() => handleSelect('men')}
          className="gender-select-card"
        >
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80"
            alt="Shop Men"
            className="gender-card-bg-img"
          />
          <div className="gender-card-overlay-box">
            <span className="gender-card-subtitle">
              DISCOVER APPAREL
            </span>
            <h3 className="gender-card-heading">
              MEN'S COLLECTION
            </h3>
            <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
              EXPLORE MEN <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* WOMEN CARD */}
        <div
          onClick={() => handleSelect('women')}
          className="gender-select-card"
        >
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80"
            alt="Shop Women"
            className="gender-card-bg-img"
          />
          <div className="gender-card-overlay-box">
            <span className="gender-card-subtitle">
              DISCOVER APPAREL
            </span>
            <h3 className="gender-card-heading">
              WOMEN'S COLLECTION
            </h3>
            <button className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
              EXPLORE WOMEN <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderSelector;
