import React, { useEffect } from "react";

const Chatpage = () => {
  useEffect(() => {
    // Inject Botpress WebChat script
    const injectScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;

        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
      });
    };

    const initializeBotpressChat = async () => {
      try {
        await injectScript("https://cdn.botpress.cloud/webchat/v2.2/inject.js");
        await injectScript(
          "https://files.bpcontent.cloud/2024/12/05/20/20241205200748-UARSGX7U.js"
        );

        if (window.botpressWebChat) {
          window.botpressWebChat.init({
            host: "https://cdn.botpress.cloud",
            botId: "your-bot-id", // Replace with your bot's actual ID
            hideWidget: false,
            botName: "My Chatbot",
            welcomeMessage: "Hi there! How can I assist you today?",
            theme: {
              primaryColor: "#4CAF50",
              secondaryColor: "#ffffff",
              fontFamily: "Arial, sans-serif",
            },
            position: "bottom-right",
          });
          console.log("Botpress WebChat initialized.");
        } else {
          console.error("Botpress WebChat script failed to load.");
        }
      } catch (error) {
        console.error("Error initializing Botpress WebChat:", error);
      }
    };

    initializeBotpressChat();
  }, []); // Removed dependency on isAuthenticated

  return null; // No visible UI component; chatbot is a floating widget
};

export default Chatpage;
