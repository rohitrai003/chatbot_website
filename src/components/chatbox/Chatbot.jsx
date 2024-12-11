import React, { useState } from "react";
import axios from "axios";
import "../chatbox/Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const parseBoldText = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) =>
          part.startsWith("**") && part.endsWith("**") ? (
            
          <b key={index}>{part.slice(2, -2)}</b>
          
          ) : (
            part 
          )
        );
      };
      


    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          handleButtonClick();
        }
      };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await axios.post("http://localhost:5000/generate", {
                prompt: input,
            });

            const botMessage = {
                role: "assistant",
                content: response.data.response,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error:", error);
            const botMessage = {
                role: "assistant",
                content: "Oops! Something went wrong. Please try again.",
            };
            setMessages((prev) => [...prev, botMessage]);
        }

        setInput("");
    };

    return (
        <div className="container">
            <h1 className="header">Gemini Chatbot</h1>
            <div className="chatWindow">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="messageContainer"
                        style={{
                            
                            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        }}
                    >
                        <div
                           className="messageBubble"
                           style={{
                           
                                backgroundColor: msg.role === "user" ? "#DCF8C6" : "#FFF",
                            }}
                        >
                            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>
                            <p className="messageText">{parseBoldText(msg.content)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="inputContainer">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="input"
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSend}  className="sendButton">
                    Send
                </button>
            </div>
        </div>
    );
};


export default Chatbot;
