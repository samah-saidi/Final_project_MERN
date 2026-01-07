import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Bonjour ! Je suis votre assistant financier SmartWallet. Comment puis-je vous aider aujourd\'hui ?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = { role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai/financial-assistant', {
                message: userMessage.text,
                history: messages.slice(-10).map(m => ({ role: m.role, content: m.text }))
            });

            setMessages(prev => [...prev, { role: 'assistant', text: response.data.reply }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, { role: 'assistant', text: "Désolé, je rencontre une petite difficulté technique. Réessayez dans un instant." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Bubble Button */}
            <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '❌' : '🤖'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window card">
                    <div className="chat-header">
                        <h4>Assistant SmartWallet AI</h4>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-wrapper ${msg.role}`}>
                                <div className="message-content">
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-wrapper assistant">
                                <div className="message-content loading-dots">
                                    <span>.</span><span>.</span><span>.</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            placeholder="Posez votre question..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()}>
                            ➔
                        </button>
                    </form>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .chat-bubble {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s ease;
                }
                .chat-bubble:hover {
                    transform: scale(1.1);
                }
                .chat-window {
                    position: fixed;
                    bottom: 100px;
                    right: 30px;
                    width: 350px;
                    height: 500px;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: slideUp 0.3s ease;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .chat-header {
                    padding: 1rem;
                    background: rgba(255,255,255,0.05);
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .message-wrapper {
                    display: flex;
                    width: 100%;
                }
                .message-wrapper.user { justify-content: flex-end; }
                .message-content {
                    max-width: 80%;
                    padding: 0.8rem 1rem;
                    border-radius: 15px;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                .user .message-content {
                    background: #667eea;
                    color: white;
                    border-bottom-right-radius: 2px;
                }
                .assistant .message-content {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                    border-bottom-left-radius: 2px;
                }
                .chat-input-area {
                    padding: 1rem;
                    display: flex;
                    gap: 0.5rem;
                    background: rgba(255,255,255,0.05);
                }
                .chat-input-area input {
                    flex: 1;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 0.5rem 1rem;
                    color: white;
                    outline: none;
                }
                .chat-input-area button {
                    background: #667eea;
                    border: none;
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                }
                .chat-input-area button:disabled {
                    opacity: 0.5;
                }
                .loading-dots span {
                    animation: blink 1s infinite;
                    font-weight: bold;
                    font-size: 1.5rem;
                }
                .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes blink {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}} />
        </>
    );
};

export default AIChatbot;
