import React from 'react';
import { Link } from 'react-router-dom';

const SpecialOffersSection = () => {
  return (
    <section className="section-space container">
      <div className="offers-cards-grid">
        {/* Deal 1 */}
        <div className="offer-card-box light">
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', color: '#e53935', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            LIMITED TIME OFFER
          </span>
          <h3 className="offer-card-title">
            FLAT 20% OFF ON ORDERS OVER $60
          </h3>
          <p className="offer-card-desc">
            Use promo code <strong style={{ color: '#111' }}>WELCOME20</strong> at checkout to unlock instant discounts across all jackets, denims, and knitwear.
          </p>
          <div>
            <Link to="/offers" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}>
              SHOP SPECIAL OFFERS
            </Link>
          </div>
        </div>

        {/* Deal 2 */}
        <div className="offer-card-box dark">
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', color: '#f5a623', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            FREE SHIPPING WORLDWIDE
          </span>
          <h3 className="offer-card-title">
            EXPRESS 2-DAY DELIVERY
          </h3>
          <p className="offer-card-desc" style={{ color: '#bbb' }}>
            Order today and receive priority doorstep delivery with hassle-free 30-day money-back returns.
          </p>
          <div>
            <Link to="/men" className="btn-secondary" style={{ backgroundColor: '#ffffff', color: '#111111', padding: '0.65rem 1.25rem', fontSize: '0.8rem' }}>
              EXPLORE CATALOG
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffersSection;
