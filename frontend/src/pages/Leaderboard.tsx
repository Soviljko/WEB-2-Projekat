import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuizzes, QuizSummary } from '../services/QuizService.ts';
import { getQuizLeaderboard, ResultResponse } from '../services/ResultService.ts';
import { formatShortDate } from '../utils/dateUtils.ts';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
    const [leaderboardResults, setLeaderboardResults] = useState<ResultResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResults, setLoadingResults] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const data = await getAllQuizzes();
                setQuizzes(data);
                if (data.length > 0) {
                    setSelectedQuizId(data[0].Id);
                }
            } catch (err) {
                console.error('Error fetching quizzes:', err);
                setError('Greška pri učitavanju kvizova');
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!selectedQuizId) return;

            try {
                setLoadingResults(true);
                const data = await getQuizLeaderboard(selectedQuizId, 10);
                setLeaderboardResults(data);
            } catch (err) {
                console.error('Error fetching leaderboard:', err);
                setError('Greška pri učitavanju rang liste');
            } finally {
                setLoadingResults(false);
            }
        };

        fetchLeaderboard();
    }, [selectedQuizId]);

    const formatTimeSpan = (timeSpan: string) => {
        const parts = timeSpan.split(':');
        if (parts.length >= 2) {
            const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            const seconds = parseInt(parts[2] || '0');
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return timeSpan;
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return '🥇';
            case 2:
                return '🥈';
            case 3:
                return '🥉';
            default:
                return `${rank}.`;
        }
    };

    const getRankClass = (rank: number) => {
        switch (rank) {
            case 1:
                return 'gold';
            case 2:
                return 'silver';
            case 3:
                return 'bronze';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <div className="leaderboard-container">
                <div className="loading">Učitavanje...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="leaderboard-container">
                <div className="empty-state">
                    <h2>Nema dostupnih kvizova</h2>
                    <p>Trenutno nema kvizova za prikaz rang liste.</p>
                </div>
            </div>
        );
    }

    const selectedQuiz = quizzes.find(q => q.Id === selectedQuizId);

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <h1>Rang lista</h1>
                <p>Pogledajte najbolje rezultate na kvizovima</p>
            </div>

            <div className="quiz-selector">
                <label htmlFor="quiz-select">Izaberite kviz:</label>
                <select
                    id="quiz-select"
                    value={selectedQuizId || ''}
                    onChange={(e) => setSelectedQuizId(Number(e.target.value))}
                >
                    {quizzes.map((quiz) => (
                        <option key={quiz.Id} value={quiz.Id}>
                            {quiz.Title}
                        </option>
                    ))}
                </select>
            </div>

            {selectedQuiz && (
                <div className="quiz-info-banner">
                    <h3>{selectedQuiz.Title}</h3>
                    <div className="quiz-meta">
                        <span>📚 {selectedQuiz.Category}</span>
                        <span>❓ {selectedQuiz.QuestionCount} pitanja</span>
                        <span className={`difficulty-badge ${selectedQuiz.Difficulty.toLowerCase()}`}>
                            {selectedQuiz.Difficulty}
                        </span>
                    </div>
                </div>
            )}

            {loadingResults ? (
                <div className="loading-results">Učitavanje rezultata...</div>
            ) : leaderboardResults.length === 0 ? (
                <div className="empty-results">
                    <p>Još nema rezultata za ovaj kviz.</p>
                    <button onClick={() => navigate(`/quiz/take/${selectedQuizId}`)} className="try-button">
                        Budite prvi!
                    </button>
                </div>
            ) : (
                <div className="leaderboard-table">
                    <div className="table-header">
                        <div className="rank-column">Rang</div>
                        <div className="user-column">Korisnik</div>
                        <div className="score-column">Poeni</div>
                        <div className="percentage-column">Procenat</div>
                        <div className="time-column">Vreme</div>
                        <div className="date-column">Datum</div>
                    </div>

                    <div className="table-body">
                        {leaderboardResults.map((result, index) => (
                            <div key={result.Id} className={`table-row ${getRankClass(index + 1)}`}>
                                <div className="rank-column">
                                    <span className="rank-icon">{getRankIcon(index + 1)}</span>
                                </div>
                                <div className="user-column">
                                    <span className="username">{result.Username}</span>
                                </div>
                                <div className="score-column">
                                    <span className="score">{result.TotalPoints} / {result.MaxPoints}</span>
                                </div>
                                <div className="percentage-column">
                                    <span className="percentage">{result.SuccessRate.toFixed(1)}%</span>
                                </div>
                                <div className="time-column">
                                    <span className="time">{formatTimeSpan(result.TimeSpent)}</span>
                                </div>
                                <div className="date-column">
                                    <span className="date">
                                        {formatShortDate(result.SubmittedAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="leaderboard-actions">
                <button onClick={() => navigate('/quizzes')} className="back-button">
                    Nazad na kvizove
                </button>
                {selectedQuizId && (
                    <button
                        onClick={() => navigate(`/quiz/take/${selectedQuizId}`)}
                        className="take-quiz-button"
                    >
                        Pokušaj ovaj kviz
                    </button>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
