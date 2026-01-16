import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/ChatBot.module.css';

// ✅ Correct API Key from your screenshot
const API_KEY = "AIzaSyBJD6ePnmry0OViSydchpZ9YtuIAjoWamk";

// ✅ Update: Using gemini-2.0-flash (confirmed available in your API key)
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, isError?: boolean }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const askAI = async () => {
        if (!input.trim()) return;
        const userMessage = input;

        // Show User Message
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userMessage }] }]
                })
            });

            const data = await response.json();

            // Handle Potential API Errors
            if (data.error) {
                console.error("API Error Response:", data.error);
                setMessages(prev => [...prev, { role: 'ai', text: `AI Error: ${data.error.message}`, isError: true }]);
            } else {
                const aiText = data.candidates[0].content.parts[0].text;
                setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Network Error: Please check your internet connection.", isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button className={styles.toggleButton} onClick={() => setIsOpen(true)}>
                    💬
                </button>
            )}

            <div className={styles.chatContainer} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className={styles.chatHeader} onClick={() => setIsOpen(false)}>
                    <span>🛍️ Shopping Assistant</span>
                    <span style={{ cursor: 'pointer' }}>▼</span>
                </div>
                <div className={styles.chatBox} ref={chatBoxRef}>
                    {messages.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                            Hello! How can I help you today?
                        </p>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={msg.role === 'user'
                                ? { textAlign: 'right', margin: '8px', color: '#1a73e8' }
                                : msg.isError
                                    ? { color: 'red', margin: '8px' }
                                    : { textAlign: 'left', margin: '8px', color: '#333', background: '#e8f0fe', padding: '10px', borderRadius: '12px' }
                            }
                        >
                            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
                        </div>
                    ))}
                    {isLoading && <div style={{ textAlign: 'left', margin: '8px', color: '#888' }}>Typing...</div>}
                </div>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.userInput}
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    />
                    <button className={styles.sendBtn} onClick={askAI}>
                        {'>'}
                    </button>
                </div>
            </div>
        </>
    );
}
