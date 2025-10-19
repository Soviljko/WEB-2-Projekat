import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, QuizResponse } from '../services/QuizService.ts';
import '../styles/QuizDetails.css';

const QuizDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                setLoading(true);
                const data = await getQuizById(Number(id));
                setQuiz(data);
            } catch (err) {
                console.error('Error fetching quiz details:', err);
                setError('Greška pri učitavanju kviza. Molimo pokušajte ponovo.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchQuizDetails();
        }
    }, [id]);

    const handleStartQuiz = () => {
        navigate(`/quiz/take/${id}`);
    };

    const handleBackToQuizzes = () => {
        navigate('/quizzes');
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return '#4caf50';
            case 'medium':
                return '#ff9800';
            case 'hard':
                return '#f44336';
            default:
                return '#757575';
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return 'Lako';
            case 'medium':
                return 'Srednje';
            case 'hard':
                return 'Teško';
            default:
                return difficulty;
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="quiz-details-container">
                <div className="loading">Učitavanje...</div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="quiz-details-container">
                <div className="error">{error || 'Kviz nije pronađen'}</div>
                <button onClick={handleBackToQuizzes} className="back-button">
                    Nazad na kvizove
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-details-container">
            <div className="quiz-details-card">
                <div className="quiz-header">
                    <h1>{quiz.Title}</h1>
                    <span
                        className="difficulty-badge"
                        style={{ backgroundColor: getDifficultyColor(quiz.Difficulty) }}
                    >
                        {getDifficultyLabel(quiz.Difficulty)}
                    </span>
                </div>

                {quiz.Description && (
                    <p className="quiz-description">{quiz.Description}</p>
                )}

                <div className="quiz-info-grid">
                    <div className="info-item">
                        <div className="info-icon">📚</div>
                        <div className="info-content">
                            <div className="info-label">Kategorija</div>
                            <div className="info-value">{quiz.Category || 'Opšte'}</div>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">❓</div>
                        <div className="info-content">
                            <div className="info-label">Broj pitanja</div>
                            <div className="info-value">{quiz.Questions.length}</div>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">⏱️</div>
                        <div className="info-content">
                            <div className="info-label">Vremensko ograničenje</div>
                            <div className="info-value">{formatTime(quiz.LimitTime)}</div>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">🎯</div>
                        <div className="info-content">
                            <div className="info-label">Ukupno poena</div>
                            <div className="info-value">
                                {quiz.Questions.reduce((sum, q) => sum + q.Points, 0)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quiz-questions-preview">
                    <h2>Pregled pitanja</h2>
                    <div className="questions-list">
                        {quiz.Questions.map((question, index) => (
                            <div key={question.Id} className="question-preview-item">
                                <div className="question-number">{index + 1}</div>
                                <div className="question-info">
                                    <div className="question-type-badge">
                                        {question.QuestionType === 'SingleChoice' && '📝 Jedan tačan odgovor'}
                                        {question.QuestionType === 'MultipleChoice' && '☑️ Više tačnih odgovora'}
                                        {question.QuestionType === 'TrueFalse' && '✓/✗ Tačno/Netačno'}
                                        {question.QuestionType === 'TextAnswer' && '✏️ Tekstualni odgovor'}
                                    </div>
                                    <div className="question-points">{question.Points} poena</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="quiz-instructions">
                    <h3>Uputstvo:</h3>
                    <ul>
                        <li>Pročitajte pažljivo svako pitanje pre nego što odgovorite</li>
                        <li>Imate vremensko ograničenje od {formatTime(quiz.LimitTime)} minuta</li>
                        <li>Možete navigirati između pitanja tokom kviza</li>
                        <li>Rezultati će biti prikazani nakon završetka kviza</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button onClick={handleBackToQuizzes} className="back-button">
                        Nazad na kvizove
                    </button>
                    <button onClick={handleStartQuiz} className="start-button">
                        Započni kviz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizDetails;
