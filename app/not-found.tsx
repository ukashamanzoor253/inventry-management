"use client"
import { useState } from 'react';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle email submission here
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <div className="not-found-container">
      {/* Animated Background Elements */}
      <div className="bg-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
        <div className="circle circle-4"></div>
      </div>

      <div className="content-wrapper">
        {/* 404 Illustration */}
        <div className="illustration">
          <div className="glitch-wrapper">
            <h1 className="glitch" data-text="404">
              404
            </h1>
          </div>
          <div className="floating-elements">
            <div className="float-element">?</div>
            <div className="float-element">!</div>
            <div className="float-element">⚡</div>
            <div className="float-element">🔍</div>
          </div>
        </div>

        {/* Error Message */}
        <div className="message-container">
          <span className="badge">ERROR 404</span>
          <h2 className="title">Page Not Found</h2>
          <p className="description">
            Oops! The page you are looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>
        </div>

        {/* Search Form */}
        <div className="search-container">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for updates"
                required
                className="email-input"
              />
              <button type="submit" className="submit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Notify Me
              </button>
            </div>
          </form>
          {isSubmitted && (
            <div className="success-message">
              ✓ Thanks! We'll notify you when we're back.
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn-primary"
            onClick={() => window.location.href = '/'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12L12 3L21 12L12 21L3 12Z"></path>
              <path d="M12 3v18"></path>
              <path d="M3 12h18"></path>
            </svg>
            Back to Home
          </button>
          <button 
            className="btn-secondary"
            onClick={() => window.location.href = '/contact'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Contact Support
          </button>
        </div>

        {/* Helpful Links */}
        <div className="helpful-links">
          <p>You might want to check:</p>
          <div className="links-grid">
            <a href="/" className="link-item">🏠 Homepage</a>
            <a href="/blog" className="link-item">📝 Blog</a>
            <a href="/products" className="link-item">🛍️ Products</a>
            <a href="/faq" className="link-item">❓ FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;