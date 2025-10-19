import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllResults, ResultResponse } from '../services/ResultService.ts';
import { formatDateWithTime } from '../utils/dateUtils.ts';
import '../styles/AdminResults.css';

const AdminResults = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState<ResultResponse[]>([]);
    const [filteredResults, setFilteredResults] = useState<ResultResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await getAllResults();
                setResults(data);
                setFilteredResults(data);
            } catch (err) {
                console.error('Error fetching results:', err);
                setError('Greška pri učitavanju rezultata');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = results.filter(r =>
                r.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.QuizTitle.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults(results);
        }
    }, [searchTerm, results]);

    if (loading) {
        return (
            <div className="admin-results-container">
                <div className="loading">Učitavanje...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-results-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="admin-results-container">
            <h1>Rezultati svih korisnika</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Pretraži po korisniku ili kvizu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredResults.length === 0 ? (
                <div className="empty-state">
                    <p>Nema rezultata za prikaz.</p>
                </div>
            ) : (
                <div className="results-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Korisnik</th>
                                <th>Kviz</th>
                                <th>Datum</th>
                                <th>Tačno</th>
                                <th>Procenat</th>
                                <th>Poeni</th>
                                <th>Akcije</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.map((result) => (
                                <tr key={result.Id}>
                                    <td className="username">{result.Username}</td>
                                    <td className="quiz-title">{result.QuizTitle}</td>
                                    <td>{formatDateWithTime(result.SubmittedAt)}</td>
                                    <td>{result.CorrectCount} / {result.TotalQuestions}</td>
                                    <td>
                                        <span className={`percentage ${result.SuccessRate >= 60 ? 'pass' : 'fail'}`}>
                                            {result.SuccessRate.toFixed(1)}%
                                        </span>
                                    </td>
                                    <td>{result.TotalPoints} / {result.MaxPoints}</td>
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

export default AdminResults;
