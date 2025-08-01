import logo from './logo.png';
import './App.css';
import { useEffect } from "react";
import Home from "./Home";

function App() {
  useEffect(() => {
    if( window.location.href.includes("com.mafooly.caloriai")) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      const androidPackageName = "com.mafooly.caloriai"; // 🔁 Replace with your Android app's package name
      const iosAppId = "6747341703"; // 🔁 Replace with your iOS app's App Store ID
      
      if (/android/i.test(userAgent)) {
        // Try to open Play Store app directly using intent
        window.location.href = `intent://details?id=${androidPackageName}#Intent;scheme=market;package=com.android.vending;end`;
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        // Try to open App Store app directly using itms-apps
        window.location.href = `itms-apps://apps.apple.com/app/id${iosAppId}`;
      } else {
        console.log("Not a supported mobile device.");
      }
    }
    
  }, []);
  
  /*useEffect(() => {
    console.log('pathname', window.location.pathname)
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
  }, []);*/
  
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
