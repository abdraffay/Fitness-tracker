import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to chat
        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: input }],
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    },
                }
            );

            // Add AI response to chat
            const reply = response.data.choices[0].message.content;
            setMessages([...newMessages, { role: "assistant", content: reply }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages([...newMessages, { role: "assistant", content: "Something went wrong!" }]);
        }
    };

    return (
        <div>
            <h1>OpenAI Chatbot</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.role === "user" ? "You:" : "AI:"}</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default ChatBot;
