import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserResults, ResultResponse } from '../services/ResultService.ts';
import { formatDateWithTime } from '../utils/dateUtils.ts';
import '../styles/MyResults.css';

const MyResults = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<ResultResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getUserResults();
                setResults(data);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError('Greška pri učitavanju rezultata');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const formatTimeSpan = (timeSpan: string) => {
        const parts = timeSpan.split(':');
        if (parts.length >= 2) {
            const minutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
            const seconds = parseInt(parts[2] || '0');
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return timeSpan;
    };

    if (loading) {
        return (
            <div className="my-results-container">
                <div className="loading">Učitavanje...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-results-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="my-results-container">
            <h1>Moji rezultati</h1>

            {results.length === 0 ? (
                <div className="empty-state">
                    <p>Još niste rešili nijedan kviz.</p>
                    <button onClick={() => navigate('/quizzes')} className="go-to-quizzes-btn">
                        Idi na kvizove
                    </button>
                </div>
            ) : (
                <div className="results-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Kviz</th>
                                <th>Datum</th>
                                <th>Tačno</th>
                                <th>Procenat</th>
                                <th>Poeni</th>
                                <th>Vreme</th>
                                <th>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.Id}>
                                    <td className="quiz-title">{result.QuizTitle}</td>
                                    <td>{formatDateWithTime(result.SubmittedAt)}</td>
                                    <td>{result.CorrectCount} / {result.TotalQuestions}</td>
                                    <td>
                                        <span className={`percentage ${result.SuccessRate >= 60 ? 'pass' : 'fail'}`}>
                                            {result.SuccessRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td>{result.TotalPoints} / {result.MaxPoints}</td>
                                    <td>{formatTimeSpan(result.TimeSpent)}</td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/result/${result.Id}`)}
                                            className="view-btn"
                                        >
                                            Pogledaj
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyResults;
