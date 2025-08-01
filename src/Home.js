import React, { useState } from "react";
import "./App.css";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
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
      
      {/* LINKS */}
      <div className="links">
        <a href="privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>
      </div>
      
      <footer>
        &copy; 2025 CapCal AI. All rights reserved.
      </footer>
    </div>
  );
}
