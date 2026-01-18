import React, { useState, useRef, useEffect } from 'react';
import styles from '@/styles/ChatBot.module.css';

// Simple relative path - works for both local dev and Vercel deployment
const API_URL = '/api/chat';

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
            // Use our secure backend API instead of direct Gemini call
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessages(prev => [...prev, {
                    role: 'ai',
                    text: data.message || 'Sorry, I encountered an error. Please try again.',
                    isError: true
                }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "Network Error: Please check your internet connection.",
                isError: true
            }]);
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
                    <span>🛍️ LUXE Shopping Assistant</span>
                    <span style={{ cursor: 'pointer' }}>✕</span>
                </div>
                <div className={styles.chatBox} ref={chatBoxRef}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '20px', padding: '1rem' }}>
                            <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👋</p>
                            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Hello! I&apos;m your LUXE assistant</p>
                            <p style={{ fontSize: '0.85rem' }}>Ask me about our products, sizes, prices, or any shopping help!</p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={msg.role === 'user' ? styles.userMessage : msg.isError ? styles.errorMessage : styles.aiMessage}
                        >
                            <strong>{msg.role === 'user' ? 'You' : '🤖 LUXE'}:</strong> {msg.text}
                        </div>
                    ))}
                    {isLoading && (
                        <div className={styles.aiMessage}>
                            <span style={{ display: 'inline-flex', gap: '4px' }}>
                                <span className={styles.typingDot}>●</span>
                                <span className={styles.typingDot} style={{ animationDelay: '0.2s' }}>●</span>
                                <span className={styles.typingDot} style={{ animationDelay: '0.4s' }}>●</span>
                            </span>
                        </div>
                    )}
                </div>
                <div className={styles.inputArea}>
                    <input
                        type="text"
                        className={styles.userInput}
                        placeholder="Ask me about products, prices..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askAI()}
                    />
                    <button className={styles.sendBtn} onClick={askAI} disabled={isLoading}>
                        {isLoading ? '...' : '➤'}
                    </button>
                </div>
            </div>
        </>
    );
}
