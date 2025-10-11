import React, { useEffect, useState, useCallback } from 'react';
import { getAllQuizzes, QuizSummary } from '../services/QuizService.ts';
import { useNavigate } from 'react-router-dom';
import '../styles/Quizzes.css';

const Quizzes: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<QuizSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await getAllQuizzes();
            setQuizzes(data);
            setFilteredQuizzes(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load quizzes');
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterQuizzes = useCallback(() => {
        let filtered = [...quizzes];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(q =>
                q.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.Description && q.Description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by difficulty
        if (selectedDifficulty !== 'All') {
            filtered = filtered.filter(q => q.Difficulty === selectedDifficulty);
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(q => q.Category === selectedCategory);
        }

        setFilteredQuizzes(filtered);
    }, [quizzes, searchTerm, selectedDifficulty, selectedCategory]);

    useEffect(() => {
        filterQuizzes();
    }, [filterQuizzes]);

    const handleStartQuiz = (id: number) => {
        navigate(`/quiz/take/${id}`);
    };

    const handleViewDetails = (id: number) => {
        navigate(`/quiz/details/${id}`);
    };

    // Get unique categories
    const categories = ['All', ...Array.from(new Set(quizzes.map(q => q.Category)))];

    if (loading) {
        return <div className="loading">Loading quizzes...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="quizzes-container">
            <div className="quizzes-header">
                <h1>Available Quizzes</h1>
                <p>Test your knowledge with our collection of quizzes</p>
            </div>

            <div className="filters-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label>Difficulty:</label>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredQuizzes.length === 0 ? (
                <div className="no-quizzes">
                    <p>No quizzes found matching your criteria.</p>
                </div>
            ) : (
                <div className="quizzes-grid">
                    {filteredQuizzes.map((quiz) => (
                        <div key={quiz.Id} className="quiz-card-user">
                            <div className="quiz-card-header">
                                <h3>{quiz.Title}</h3>
                                <span className={`difficulty-badge ${quiz.Difficulty.toLowerCase()}`}>
                                    {quiz.Difficulty}
                                </span>
                            </div>

                            <div className="quiz-card-body">
                                <p className="quiz-description">
                                    {quiz.Description || 'No description available'}
                                </p>

                                <div className="quiz-info">
                                    <div className="info-item">
                                        <span className="info-label">Category:</span>
                                        <span className="info-value">{quiz.Category}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Questions:</span>
                                        <span className="info-value">{quiz.QuestionCount}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Time Limit:</span>
                                        <span className="info-value">{Math.floor(quiz.LimitTime / 60)} min</span>
                                    </div>
                                </div>
                            </div>

                            <div className="quiz-card-actions">
                                <button
                                    onClick={() => handleViewDetails(quiz.Id)}
                                    className="btn-secondary"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleStartQuiz(quiz.Id)}
                                    className="btn-primary"
                                >
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="quiz-count">
                Showing {filteredQuizzes.length} of {quizzes.length} quizzes
            </div>
        </div>
    );
};

export default Quizzes;
