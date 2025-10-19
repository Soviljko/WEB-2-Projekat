import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById, ResultResponse } from '../services/ResultService.ts';
import '../styles/QuizResult.css';

const QuizResult = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [result, setResult] = useState<ResultResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                setLoading(true);
                const data = await getResultById(Number(id));
                setResult(data);
            } catch (err) {
                console.error('Error fetching result:', err);
                setError('Greška pri učitavanju rezultata');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchResult();
        }
    }, [id]);

    const formatTimeSpan = (timeSpan: string) => {
        // TimeSpan format from C#: "hh:mm:ss"
        const parts = timeSpan.split(':');
        if (parts.length >= 2) {
            const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            const seconds = parseInt(parts[2] || '0');
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return timeSpan;
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return '#4caf50';
        if (percentage >= 60) return '#ff9800';
        return '#f44336';
    };

    const getScoreLabel = (percentage: number) => {
        if (percentage >= 90) return 'Odlično!';
        if (percentage >= 80) return 'Vrlo dobro!';
        if (percentage >= 70) return 'Dobro!';
        if (percentage >= 60) return 'Prolazno';
        return 'Pokušajte ponovo';
    };

    if (loading) {
        return (
            <div className="quiz-result-container">
                <div className="loading">Učitavanje...</div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="quiz-result-container">
                <div className="error">{error || 'Rezultat nije pronađen'}</div>
                <button onClick={() => navigate('/quizzes')} className="back-button">
                    Nazad na kvizove
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-result-container">
            <div className="result-card">
                <div className="result-header">
                    <h1>Rezultati kviza</h1>
                    <h2>{result.QuizTitle}</h2>
                </div>

                <div className="score-summary">
                    <div className="score-circle" style={{ borderColor: getScoreColor(result.SuccessRate) }}>
                        <div className="score-percentage" style={{ color: getScoreColor(result.SuccessRate) }}>
                            {result.SuccessRate.toFixed(1)}%
                        </div>
                        <div className="score-label">{getScoreLabel(result.SuccessRate)}</div>
                    </div>

                    <div className="score-details">
                        <div className="detail-item">
                            <span className="detail-icon">✓</span>
                            <div>
                                <div className="detail-label">Tačni odgovori</div>
                                <div className="detail-value">{result.CorrectCount} / {result.TotalQuestions}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="detail-icon">🎯</span>
                            <div>
                                <div className="detail-label">Osvojeni poeni</div>
                                <div className="detail-value">{result.TotalPoints} / {result.MaxPoints}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <span className="detail-icon">⏱️</span>
                            <div>
                                <div className="detail-label">Vreme</div>
                                <div className="detail-value">{formatTimeSpan(result.TimeSpent)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="answers-review">
                    <h3>Pregled odgovora</h3>
                    <div className="answers-list">
                        {result.Answers.map((answer, index) => (
                            <div key={answer.QuestionId} className={`answer-item ${answer.IsCorrect ? 'correct' : 'incorrect'}`}>
                                <div className="answer-header">
                                    <span className="answer-number">Pitanje {index + 1}</span>
                                    <span className={`answer-status ${answer.IsCorrect ? 'correct' : 'incorrect'}`}>
                                        {answer.IsCorrect ? '✓ Tačno' : '✗ Netačno'}
                                    </span>
                                    <span className="answer-points">
                                        {answer.IsCorrect ? answer.Points : 0} / {answer.Points} poena
                                    </span>
                                </div>

                                <div className="question-text">{answer.QuestionText}</div>

                                {answer.EnteredText ? (
                                    <div className="text-answer">
                                        <div className="your-answer">
                                            <strong>Vaš odgovor:</strong> {answer.EnteredText}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="options-review">
                                        {answer.Options.map((option) => {
                                            const isSelected = answer.SelectedOptionIds?.includes(option.Id);
                                            const isCorrect = option.IsCorrect;

                                            return (
                                                <div
                                                    key={option.Id}
                                                    className={`option-review ${isSelected ? 'selected' : ''} ${
                                                        isCorrect ? 'correct-option' : ''
                                                    }`}
                                                >
                                                    <div className="option-indicator">
                                                        {isSelected && isCorrect && '✓'}
                                                        {isSelected && !isCorrect && '✗'}
                                                        {!isSelected && isCorrect && '→'}
                                                    </div>
                                                    <span className="option-text">{option.Text}</span>
                                                    {isCorrect && !isSelected && (
                                                        <span className="correct-label">Tačan odgovor</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="result-actions">
                    <button onClick={() => navigate('/quizzes')} className="secondary-button">
                        Nazad na kvizove
                    </button>
                    <button onClick={() => navigate(`/quiz/take/${result.QuizId}`)} className="primary-button">
                        Pokušaj ponovo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
