import React from "react";
import { FaCheck, FaFacebook, FaYoutube, FaInstagram, FaPinterest, FaTiktok, FaCcPaypal, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcAmazonPay } from "react-icons/fa";
import { BsBank } from "react-icons/bs";
import { SiDinersclub } from "react-icons/si";
import "../../pages/home/HomePage.css"

const Footer = () => (
  <footer className="site-footer">
    {/* --- FOOTER --- */}
          <footer className="site-footer">
            {/* Newsletter */}
            <div className="newsletter-section">
              <div className="newsletter-content">
                <div className="newsletter-left">
                  <div className="newsletter-icon-wrapper">
                    <span style={{ fontSize: 24 }}>🎟️</span>
                  </div>
                  <div className="newsletter-text">
                    <h3>Luna Newsletter</h3>
                    <p>
                      Subscribe to the Luna Newsletter and with a bit of luck win
                      one of 50 vouchers worth €50 each!
                    </p>
                    <ul className="newsletter-benefits">
                      <li>
                        <FaCheck className="check-icon-small" /> Inspirational
                        contributions
                      </li>
                      <li>
                        <FaCheck className="check-icon-small" /> Deals
                      </li>
                      <li>
                        <FaCheck className="check-icon-small" /> Luna Insights
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="newsletter-right">
                  <div className="input-group">
                    <input type="email" placeholder="Email address*" />
                    <button>Sign up now</button>
                  </div>
                  <p className="disclaimer">
                    By clicking on "Sign up now", you agree to receiving e-mail
                    advertising. You can unsubscribe at any time.
                  </p>
                  <p className="required-hint">* Required</p>
                </div>
              </div>
            </div>
    
            {/* Info Section */}
            <div className="footer-info-section">
              <div className="footer-col">
                <h4>Shop and pay safely</h4>
                <div className="payment-icons">
                  <FaCcPaypal className="pay-icon" style={{ color: "#003087" }} />
                  <FaCcAmazonPay
                    className="pay-icon"
                    style={{ color: "#232f3e" }}
                  />
                  <FaCcVisa className="pay-icon" style={{ color: "#1a1f71" }} />
                  <FaCcMastercard
                    className="pay-icon"
                    style={{ color: "#eb001b" }}
                  />
                  <FaCcAmex className="pay-icon" style={{ color: "#2e77bc" }} />
                  <SiDinersclub className="pay-icon" style={{ color: "#004a97" }} />
                  <BsBank className="pay-icon" style={{ color: "#555" }} />
                </div>
                <p className="payment-desc">
                  Payment can be made safely and securely with PayPal, Amazon Pay,
                  Credit Card or Bank Transfer.
                </p>
              </div>
    
              <div className="footer-col">
                <h4>Your benefits</h4>
                <ul className="footer-list-check">
                  <li>
                    <FaCheck className="check-icon-small" /> 3 Years Luna Warranty
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> 30-Day Money-Back
                    Guarantee
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Repair Service
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Advice from our experts
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Satisfaction Guarantee
                  </li>
                  <li>
                    <FaCheck className="check-icon-small" /> Europe's Largest
                    Warehouse
                  </li>
                </ul>
              </div>
    
              <div className="footer-col">
                <h4>Service</h4>
                <ul className="footer-list-link">
                  <li>Shipping Costs and Delivery Times</li>
                  <li>Help Centre</li>
                  <li>Vouchers</li>
                  <li>Contact us</li>
                  <li>Walk-in Store</li>
                  <li>Service Overview</li>
                </ul>
              </div>
            </div>
    
            {/* Dark Bottom Section */}
            <div className="footer-dark">
              <div className="dark-content">
                <div className="dark-col">
                  <div className="social-icons">
                    <FaFacebook /> <FaYoutube /> <FaInstagram /> <FaPinterest />{" "}
                    <FaTiktok />
                  </div>
                  <ul className="dark-links">
                    <li>Terms & Conditions / Imprint</li>
                    <li>Privacy Policy</li>
                    <li>Cookie Settings</li>
                    <li>Right of Withdrawal</li>
                    <li>Online Ordering Process</li>
                    <li>Statutory Warranty Rights</li>
                  </ul>
                </div>
    
                <div className="dark-col">
                  <ul className="dark-links">
                    <li>About Us</li>
                    <li>Jobs & Careers</li>
                    <li>Blog</li>
                    <li>Classified Ads</li>
                    <li>Whistleblower system</li>
                  </ul>
                </div>
    
                <div className="dark-col app-col">
                  <div className="app-buttons">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                    />
                  </div>
                  <div className="copyright">
                    <p>© 1996–2025 Luna GmbH.</p>
                    <p>
                      <i>Luna loves you, because you rock!</i>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
  </footer>
);

export default Footer;
