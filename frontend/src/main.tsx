import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Block browser push notification permission dialogs
if (typeof window !== "undefined" && window.Notification) {
  window.Notification.requestPermission = () => Promise.resolve("denied");
  try {
    Object.defineProperty(window.Notification, "permission", {
      get: () => "denied",
      configurable: true
    });
  } catch (e) {
    console.warn("Could not redefine Notification.permission");
  }
}

// Block Google One Tap / saved password manager dialogs
if (typeof navigator !== "undefined" && navigator.credentials) {
  const originalGet = navigator.credentials.get;
  navigator.credentials.get = function (options) {
    if (options && (options.federated || options.password || options.publicKey)) {
      return Promise.resolve(null);
    }
    return originalGet.call(this, options);
  };
}

// Block ad popup windows
if (typeof window !== "undefined") {
  const originalOpen = window.open;
  window.open = function (url, target, features) {
    console.log("Blocked window.open request for URL:", url);
    return null;
  };
}

// Replace blocking browser alert() with beautiful glassmorphic Toast notification overlay
if (typeof window !== "undefined") {
  window.alert = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Suppress trivial mock action alert dialogues completely
    const isTrivial = 
      lowerMessage.includes("marked") || 
      lowerMessage.includes("initiating manual renewal") || 
      lowerMessage.includes("opening email") || 
      lowerMessage.includes("applying retention") || 
      lowerMessage.includes("placing contact call") || 
      lowerMessage.includes("generating 20% discount") || 
      lowerMessage.includes("viewing user account") || 
      lowerMessage.includes("redirecting to") || 
      lowerMessage.includes("open the 'settings' tab");

    if (isTrivial) {
      console.log(`Suppressed trivial alert: ${message}`);
      return;
    }

    let container = document.getElementById("custom-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "custom-toast-container";
      container.style.position = "fixed";
      container.style.top = "24px";
      container.style.right = "24px";
      container.style.zIndex = "999999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "12px";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.background = "rgba(255, 255, 255, 0.95)";
    toast.style.color = "#0f172a";
    toast.style.padding = "14px 20px";
    toast.style.borderRadius = "20px";
    toast.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
    toast.style.border = "1px solid rgba(226, 232, 240, 0.8)";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.display = "flex";
    toast.style.alignItems = "center";
    toast.style.gap = "12px";
    toast.style.minWidth = "280px";
    toast.style.maxWidth = "420px";
    toast.style.pointerEvents = "auto";
    toast.style.transform = "translateX(120%)";
    toast.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease";
    toast.style.fontFamily = "'Inter', sans-serif";
    toast.style.backdropFilter = "blur(8px)";
    toast.style.opacity = "0";

    const isError = lowerMessage.includes("fail") || lowerMessage.includes("invalid") || lowerMessage.includes("error") || lowerMessage.includes("fill all") || lowerMessage.includes("match");
    const iconColor = isError ? "#f43f5e" : "#10b981";
    const iconSvg = isError 
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

    const icon = document.createElement("div");
    icon.style.display = "flex";
    icon.style.alignItems = "center";
    icon.style.justifyContent = "center";
    icon.style.flexShrink = "0";
    icon.innerHTML = iconSvg;
    toast.appendChild(icon);

    const text = document.createElement("div");
    text.style.flex = "1";
    text.style.lineHeight = "1.4";
    text.innerText = message;
    toast.appendChild(text);

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = "translateX(0)";
      toast.style.opacity = "1";
    });

    const removeToast = () => {
      toast.style.transform = "translateX(120%)";
      toast.style.opacity = "0";
      toast.addEventListener("transitionend", () => {
        toast.remove();
        if (container && container.childNodes.length === 0) {
          container.remove();
        }
      });
    };

    const timeoutId = setTimeout(removeToast, 4000);

    toast.style.cursor = "pointer";
    toast.onclick = () => {
      clearTimeout(timeoutId);
      removeToast();
    };
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);