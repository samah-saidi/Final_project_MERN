import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Swal from 'sweetalert2';

const AIAdvisor = () => {
    const { user } = useAuth();
    const [advice, setAdvice] = useState('');
    const [insights, setInsights] = useState('');
    const [loadingAdvice, setLoadingAdvice] = useState(false);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [activeTab, setActiveTab] = useState('advice');

    useEffect(() => {
        if (user) {
            if (activeTab === 'advice' && !advice) fetchAdvice();
            if (activeTab === 'insights' && !insights) fetchInsights();
        }
    }, [user, activeTab]);

    const fetchAdvice = async () => {
        setLoadingAdvice(true);
        try {
            const response = await api.get(`/ai/personalized-advice/${user._id || user.id}`);
            setAdvice(response.data.advice || '');
        } catch (error) {
            console.error('Error fetching AI advice:', error);
            Swal.fire({
                icon: 'error',
                title: 'AI Offline',
                text: 'Impossible de générer des conseils personnalisés pour le moment.',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setLoadingAdvice(false);
        }
    };

    const fetchInsights = async () => {
        setLoadingInsights(true);
        try {
            const response = await api.get('/ai/market-insights');
            setInsights(response.data.insights || '');
        } catch (error) {
            console.error('Error fetching market insights:', error);
        } finally {
            setLoadingInsights(false);
        }
    };

    const renderText = (text) => {
        if (!text || typeof text !== 'string') return null;
        return text.split('\n').filter(line => line.trim() !== '').map((line, i) => (
            <p key={i}>{line}</p>
        ));
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">
                    <span className="gradient-text">AI Advisor</span> 🤖
                </h1>
                <p className="page-subtitle text-muted">
                    Intelligence artificielle au service de votre sérénité financière.
                </p>
            </div>

            <div className="ai-tabs">
                <button
                    className={`tab-btn ${activeTab === 'advice' ? 'active' : ''}`}
                    onClick={() => setActiveTab('advice')}
                >
                    💡 Conseils Personnalisés
                </button>
                <button
                    className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                    onClick={() => setActiveTab('insights')}
                >
                    📈 Tendances Marché
                </button>
                <button
                    className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    🎓 Finance Quiz
                </button>
            </div>

            <div className="ai-content-area card">
                {activeTab === 'advice' && (
                    <div className="ai-advice-section">
                        <div className="section-header-row">
                            <h3>Votre Rapport Personnalisé</h3>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={fetchAdvice}
                                disabled={loadingAdvice}
                            >
                                {loadingAdvice ? 'Génération...' : 'Actualiser'}
                            </button>
                        </div>

                        {loadingAdvice ? (
                            <div className="ai-loading">
                                <div className="spinner"></div>
                                <p>Analyse de vos budgets et transactions en cours...</p>
                            </div>
                        ) : (
                            <div className="ai-response-box">
                                {advice ? (
                                    <div className="markdown-content">
                                        {renderText(advice)}
                                    </div>
                                ) : (
                                    <p className="empty-text">Cliquez sur Actualiser pour obtenir des conseils basés sur votre situation réelle.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div className="ai-insights-section">
                        <h3>Perspectives du Marché</h3>
                        {loadingInsights ? (
                            <div className="ai-loading">
                                <div className="spinner"></div>
                                <p>Récupération des tendances mondiales...</p>
                            </div>
                        ) : (
                            <div className="ai-response-box">
                                <div className="markdown-content">
                                    {renderText(insights) || <p className="empty-text">Aucune donnée de tendance disponible pour le moment.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <QuizModule />
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ai-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .tab-btn {
                    flex: 1;
                    padding: 0.8rem;
                    border: none;
                    background: transparent;
                    color: #fff;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                .tab-btn.active {
                    background: #667eea;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }
                .ai-content-area {
                    min-height: 500px;
                    padding: 2rem;
                    position: relative;
                }
                .section-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .ai-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 300px;
                    color: #a0aec0;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .ai-response-box {
                    line-height: 1.8;
                }
                .markdown-content p {
                    margin-bottom: 1rem;
                }
                .quiz-container {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .topic-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 2rem;
                }
                .topic-card {
                    padding: 2rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .topic-card:hover {
                    background: rgba(102,126,234,0.1);
                    border-color: #667eea;
                    transform: translateY(-5px);
                }
                .topic-card i {
                    font-size: 2.5rem;
                    display: block;
                    margin-bottom: 1rem;
                }
                .quiz-box {
                    text-align: left;
                    animation: fadeIn 0.5s ease;
                }
                .question-text {
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    font-weight: 600;
                }
                .options-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .option-btn {
                    padding: 1rem;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: white;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .option-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.1);
                }
                .option-btn.correct { background: #48bb78; border-color: #48bb78; }
                .option-btn.wrong { background: #f56565; border-color: #f56565; }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </div>
    );
};

const QuizModule = () => {
    const [quizState, setQuizState] = useState('selection'); // selection, loading, playing, finished
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const topics = [
        { id: 'budget', name: 'Gestion Budget', icon: '📊' },
        { id: 'epargne', name: 'Épargne & Fond', icon: '💰' },
        { id: 'investissement', name: 'Investissement', icon: '📈' },
        { id: 'credit', name: 'Crédit & Dette', icon: '💳' }
    ];

    const startQuiz = async (topic) => {
        setQuizState('loading');
        try {
            const response = await api.post(`/ai/finance-quiz/${topic}`);
            setQuestions(response.data);
            setQuizState('playing');
            setCurrentIndex(0);
            setScore(0);
        } catch (error) {
            console.error('Quiz error:', error);
            Swal.fire({ icon: 'error', title: 'Erreur Quiz', text: 'Impossible de générer le quiz.' });
            setQuizState('selection');
        }
    };

    const handleAnswer = (index) => {
        if (isRevealed) return;
        setSelectedOption(index);
        setIsRevealed(true);
        if (index === questions[currentIndex].answer) {
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        setIsRevealed(false);
        setSelectedOption(null);
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setQuizState('finished');
        }
    };

    if (quizState === 'selection') {
        return (
            <div className="quiz-container">
                <h3>Testez votre expertise financière</h3>
                <p className="text-muted">Choisissez un thème et répondez aux questions générées par l'IA.</p>
                <div className="topic-grid">
                    {topics.map(t => (
                        <div key={t.id} className="topic-card" onClick={() => startQuiz(t.id)}>
                            <i>{t.icon}</i>
                            <span>{t.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (quizState === 'loading') {
        return (
            <div className="ai-loading">
                <div className="spinner"></div>
                <p>Gemini prépare vos questions personnalisées...</p>
            </div>
        );
    }

    if (quizState === 'playing') {
        const q = questions[currentIndex];
        return (
            <div className="quiz-box">
                <div className="section-header-row">
                    <span>Question {currentIndex + 1} / {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div className="question-text">{q.question}</div>
                <div className="options-list">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`option-btn ${isRevealed ? (i === q.answer ? 'correct' : (i === selectedOption ? 'wrong' : '')) : ''}`}
                            onClick={() => handleAnswer(i)}
                            disabled={isRevealed}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
                {isRevealed && (
                    <button className="btn btn-primary mt-4 w-100" onClick={nextQuestion}>
                        {currentIndex < questions.length - 1 ? 'Question Suivante' : 'Voir le Résultat'}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <span style={{ fontSize: '4rem' }}>🏆</span>
            <h2 className="mt-3">Quiz Terminé !</h2>
            <p className="fs-4">Votre score : <strong>{score} / {questions.length}</strong></p>
            <p className="text-muted mb-4">
                {score === questions.length ? "Parfait ! Vous êtes un expert." : "Pas mal ! Continuez à apprendre pour optimiser vos finances."}
            </p>
            <button className="btn btn-secondary" onClick={() => setQuizState('selection')}>Réessayer</button>
        </div>
    );
};

export default AIAdvisor;
