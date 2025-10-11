import React, { useEffect, useState } from 'react';
import { getAllQuizzes, QuizSummary, deleteQuiz } from '../services/QuizService.ts';
import { useNavigate } from 'react-router-dom';
import '../styles/QuizList.css';

const QuizList: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const data = await getAllQuizzes();
            setQuizzes(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load quizzes');
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteQuiz(id);
                setQuizzes(quizzes.filter(q => q.Id !== id));
            } catch (err: any) {
                alert('Failed to delete quiz');
                console.error('Error deleting quiz:', err);
            }
        }
    };

    const handleCreateNew = () => {
        navigate('/admin/quiz/create');
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/quiz/edit/${id}`);
    };

    const handleView = (id: number) => {
        navigate(`/quiz/${id}`);
    };

    if (loading) {
        return <div className="loading">Loading quizzes...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="quiz-list-container">
            <div className="quiz-list-header">
                <h1>Quiz Management</h1>
                <button onClick={handleCreateNew} className="btn-create">
                    Create New Quiz
                </button>
            </div>

            {quizzes.length === 0 ? (
                <div className="no-quizzes">
                    <p>No quizzes found. Create your first quiz!</p>
                </div>
            ) : (
                <div className="quiz-grid">
                    {quizzes.map((quiz) => (
                        <div key={quiz.Id} className="quiz-card">
                            <div className="quiz-card-header">
                                <h3>{quiz.Title}</h3>
                                <span className={`difficulty-badge ${quiz.Difficulty.toLowerCase()}`}>
                                    {quiz.Difficulty}
                                </span>
                            </div>
                            <div className="quiz-card-body">
                                <p className="quiz-description">{quiz.Description || 'No description'}</p>
                                <div className="quiz-meta">
                                    <span className="quiz-category">{quiz.Category}</span>
                                    <span className="quiz-questions">{quiz.QuestionCount} questions</span>
                                    <span className="quiz-time">{quiz.LimitTime}s</span>
                                </div>
                            </div>
                            <div className="quiz-card-actions">
                                <button onClick={() => handleView(quiz.Id)} className="btn-view">
                                    View
                                </button>
                                <button onClick={() => handleEdit(quiz.Id)} className="btn-edit">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(quiz.Id)} className="btn-delete">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizList;
