import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function LoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsLoggedIn(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    // Simulate login process
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'John Doe');
    localStorage.setItem('userEmail', 'john@example.com');
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoggedIn) {
    return (
      <div className="auth-buttons">
        <button className="cta-btn secondary" onClick={goToDashboard}>
          Dashboard
        </button>
        <button className="logout-btn-home" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <button className="cta-btn secondary" onClick={handleLogin}>
      Login
    </button>
  );
}

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://us-central1-calorie-tracker-app-87bcb.cloudfunctions.net/sendEmailToUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "to": "marketing@capcalai.com",
          "subject": "New Support Request from CapCal AI",
          "message": "User Email : "+ formData.email +"\n"+" User Message: "+ formData.message,
          "from": "marketing@capcalai.com",
          "fromName": formData.name
        }),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.log('response', response)
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send. Please try again later.");
    }
  };

  const handleStartFreeTrial = async () => {
    try {
      // Check if user has premium subscription
      // You'll need to replace this with your actual API endpoint to check subscription status
      const response = await fetch('YOUR_SUBSCRIPTION_CHECK_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add any necessary authentication or user identification
        body: JSON.stringify({
          // Add user identification data here
        })
      });

      const data = await response.json();

      if (data.hasPremiumSubscription || data.hasActiveSubscription) {
        // Show modal if user has premium subscription
        setShowPremiumModal(true);
      } else {
        // Proceed with free trial activation
        // Add your free trial activation logic here
        console.log('Activating free trial...');
        // You might want to navigate to a different page or show success message
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // Handle error - maybe show an error message or proceed with trial
    }
  };

  const closePremiumModal = () => {
    setShowPremiumModal(false);
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <img src="hero.png" className="hero-bg-img" alt="CapCal AI Background" />
        <div className="hero-bg-overlay"></div>
        <img src="logo_rounded.png" alt="CapCal AI App Icon" className="app-logo" />
        <div className="hero-content">
          <div className="hero-title">CapCal AI</div>
          <div className="hero-sub">AI Calorie & Macro Challenges</div>
          <div className="hero-desc">
            Effortless calorie, macro, and protein tracking.<br />
            Challenge friends, scan meals with AI, and celebrate your healthy wins—fun, easy, and always motivating!
          </div>
          <a className="cta-btn" href="#contact">Contact Us</a>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <div className="section">
        <div className="features-row">
          {[
            {
              img: "Artboard 1.png",
              title: "Snap, Track, Eat",
              desc: "Monitor calories, macros, BMI, weight, and activity at a glance. Adjust your goals as you progress, and stay aligned with your health journey every day."
            },
            {
              img: "Artboard 2.png",
              title: "Snap, Track, Eat",
              desc: "Just snap a picture—CapCal AI instantly analyzes your food, giving you accurate calories and macros with no effort."
            },
            {
              img: "Artboard 3.png",
              title: "Know Every Meal",
              desc: "Instantly see protein, fats, carbs, and calories for every meal. Visual, simple, and always at your fingertips."
            },
            {
              img: "Artboard 4.png",
              title: "Challenge Friends",
              desc: "Compete in daily and weekly challenges—track steps, calories, and more. Stay accountable and motivated, together!"
            },
            {
              img: "Artboard 5.png",
              title: "Celebrate Victories",
              desc: "Win challenges, earn badges, and get cheered on with celebratory popups. Every win counts—big or small!"
            },
            {
              img: "Artboard 6.png",
              title: "Your Profile, Your Journey",
              desc: "Unlock achievements, build healthy habits, and show off your progress on your personal profile."
            }
          ].map((feature, index) => (
            <div className="feature-card" key={index}>
              <img src={feature.img} className="feature-img" alt={feature.title} />
              <div className="feature-title">{feature.title}</div>
              <div className="feature-desc">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="section" id="contact">
        <div className="contact-card">
          <h2>Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>

      {/*LINKS */}
      <div className="links">
        <a href="privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>
      </div>

      <footer>
        &copy; 2025 CapCal AI. All rights reserved.
      </footer>

      {/* Premium Subscription Modal */}
      {showPremiumModal && (
        <div className="modal-overlay">
          <div className="premium-modal">
            <div className="modal-content">
              <h2>You already have an active subscription from the store. Please cancel your current subscription to activate your free months.</h2>
              <button className="modal-ok-button" onClick={closePremiumModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}