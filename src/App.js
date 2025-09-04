import './App.css';
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {UAParser} from "ua-parser-js";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  
  function getDeviceName() {
    const parser = new UAParser();
    const result = parser.getResult();
    
    return `${result.device.vendor || "Unknown"}${result.device.model || ""}${result.os.name}${result.os.version}`;
  }
  
  function getLocalIPs(callback) {
    return callback("123456789");
    const ips = {};
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel("");
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(console.error);
    
    pc.onicecandidate = (event) => {
      console.log('event.candidate', event.candidate)
      if (!event.candidate) return;
      const regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
      const ip = regex.exec(event.candidate.candidate)[1];
      if (!ips[ip]) {
        ips[ip] = true;
        callback(ip);
      }
    };
  }
  
  useEffect(() => {
    const logClick = async (refCode) => {
      // Get public IP
      const publicIpRes = await fetch('https://api.ipify.org?format=json');
      const publicIp = (await publicIpRes.json()).ip;
      const deviceName= getDeviceName();
      console.log('publicIp', publicIp)
      
      // Get local IPs
      getLocalIPs(async (localIp) => {
        // Send both IPs + referral to backend
        await fetch('https://saveappinstall-zbhi5gq6gq-uc.a.run.app', {
          method: 'POST',
          body:JSON.stringify({
            refererId: refCode,
            deviceName,
            ipAddresses:{
              publicIp,
              localIp
            }
          })
        });
        
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
        
        console.log('Click logged:', { refCode, publicIp, localIp });
      });
    };
    
    if(window.location.href.includes("com.mafooly.caloriai/invite/")){
      const refCode = window.location.href.split('com.mafooly.caloriai/invite/').pop();
      if (refCode) logClick(refCode);
    }
  }, []);
  
  useEffect(() => {
    if( window.location.href.includes("com.mafooly.caloriai") && !window.location.href.includes("com.mafooly.caloriai/invite/")) {
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
  
  return (
    <div className="App">
      <Router>
        <Routes>
         {/* <Route path="/" element={<Home />} />*/}
          <Route path="/" element={<ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/*<Route path="*" element={<Home />} />*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
