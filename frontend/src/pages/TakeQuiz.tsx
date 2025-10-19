import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, QuizResponse } from '../services/QuizService.ts';
import { submitQuizResult } from '../services/ResultService.ts';
import '../styles/TakeQuiz.css';

interface Answer {
    questionId: number;
    selectedOptions: number[];
    textAnswer?: string;
}

const TakeQuiz = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<QuizResponse | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quizStarted, setQuizStarted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [startTime, setStartTime] = useState<number>(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuizById(Number(id));
                setQuiz(data);
                setTimeRemaining(data.LimitTime);
                // Initialize answers array
                const initialAnswers = data.Questions.map(q => ({
                    questionId: q.Id,
                    selectedOptions: [],
                    textAnswer: ''
                }));
                setAnswers(initialAnswers);
            } catch (err) {
                console.error('Error fetching quiz:', err);
                setError('Greška pri učitavanju kviza');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchQuiz();
        }
    }, [id]);

    // Timer effect
    useEffect(() => {
        if (!quizStarted || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, timeRemaining]);

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setStartTime(Date.now());
    };

    const getCurrentAnswer = useCallback(() => {
        if (!quiz) return null;
        return answers.find(a => a.questionId === quiz.Questions[currentQuestionIndex].Id);
    }, [answers, quiz, currentQuestionIndex]);

    const handleOptionSelect = (optionId: number, isMultiple: boolean) => {
        if (!quiz) return;

        const currentQuestion = quiz.Questions[currentQuestionIndex];
        const answerIndex = answers.findIndex(a => a.questionId === currentQuestion.Id);

        if (answerIndex === -1) return;

        const newAnswers = [...answers];
        const currentAnswer = newAnswers[answerIndex];

        if (isMultiple) {
            // Multiple choice - toggle option
            if (currentAnswer.selectedOptions.includes(optionId)) {
                currentAnswer.selectedOptions = currentAnswer.selectedOptions.filter(id => id !== optionId);
            } else {
                currentAnswer.selectedOptions = [...currentAnswer.selectedOptions, optionId];
            }
        } else {
            // Single choice - replace selection
            currentAnswer.selectedOptions = [optionId];
        }

        setAnswers(newAnswers);
    };

    const handleTextAnswer = (text: string) => {
        if (!quiz) return;

        const currentQuestion = quiz.Questions[currentQuestionIndex];
        const answerIndex = answers.findIndex(a => a.questionId === currentQuestion.Id);

        if (answerIndex === -1) return;

        const newAnswers = [...answers];
        newAnswers[answerIndex].textAnswer = text;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (quiz && currentQuestionIndex < quiz.Questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleQuestionJump = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmitQuiz = async () => {
        if (!quiz || submitting) return;

        setSubmitting(true);

        try {
            // Calculate time spent
            const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);

            // Prepare answers for submission
            const answersToSubmit = answers.map(a => ({
                QuestionId: a.questionId,
                SelectedOptionIds: a.selectedOptions.length > 0 ? a.selectedOptions : undefined,
                EnteredText: a.textAnswer || undefined
            }));

            // Submit result to backend
            const result = await submitQuizResult({
                QuizId: quiz.Id,
                TimeSpent: timeSpentSeconds,
                Answers: answersToSubmit
            });

            // Navigate to result page
            navigate(`/result/${result.Id}`);
        } catch (err) {
            console.error('Error submitting quiz:', err);
            alert('Greška pri slanju rezultata. Molimo pokušajte ponovo.');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getAnsweredQuestionsCount = () => {
        return answers.filter(a =>
            a.selectedOptions.length > 0 || (a.textAnswer && a.textAnswer.trim() !== '')
        ).length;
    };

    if (loading) {
        return <div className="take-quiz-container"><div className="loading">Učitavanje...</div></div>;
    }

    if (error || !quiz) {
        return (
            <div className="take-quiz-container">
                <div className="error">{error || 'Kviz nije pronađen'}</div>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="take-quiz-container">
                <div className="quiz-start-card">
                    <h1>{quiz.Title}</h1>
                    <div className="start-info">
                        <p>Spremni ste da započnete kviz!</p>
                        <ul>
                            <li>Broj pitanja: {quiz.Questions.length}</li>
                            <li>Vremensko ograničenje: {formatTime(quiz.LimitTime)}</li>
                            <li>Ukupno poena: {quiz.Questions.reduce((sum, q) => sum + q.Points, 0)}</li>
                        </ul>
                        <p className="warning">Tajmer će početi odmah nakon što kliknete "Započni".</p>
                    </div>
                    <button onClick={handleStartQuiz} className="start-quiz-button">
                        Započni kviz
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.Questions[currentQuestionIndex];
    const currentAnswer = getCurrentAnswer();

    return (
        <div className="take-quiz-container">
            <div className="quiz-header-bar">
                <div className="quiz-title-small">{quiz.Title}</div>
                <div className="quiz-timer" style={{ color: timeRemaining < 60 ? '#f44336' : '#333' }}>
                    ⏱️ {formatTime(timeRemaining)}
                </div>
            </div>

            <div className="quiz-progress">
                <div className="progress-info">
                    Pitanje {currentQuestionIndex + 1} od {quiz.Questions.length} |
                    Odgovoreno: {getAnsweredQuestionsCount()} / {quiz.Questions.length}
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.Questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="quiz-content">
                <div className="question-card">
                    <div className="question-header">
                        <span className="question-number">Pitanje {currentQuestionIndex + 1}</span>
                        <span className="question-points">{currentQuestion.Points} poena</span>
                    </div>

                    <h2 className="question-text">{currentQuestion.Text}</h2>

                    <div className="question-options">
                        {currentQuestion.QuestionType === 'TextAnswer' ? (
                            <textarea
                                className="text-answer-input"
                                value={currentAnswer?.textAnswer || ''}
                                onChange={(e) => handleTextAnswer(e.target.value)}
                                placeholder="Unesite vaš odgovor ovde..."
                                rows={4}
                            />
                        ) : (
                            currentQuestion.Options.map((option) => (
                                <div
                                    key={option.Id}
                                    className={`option-item ${
                                        currentAnswer?.selectedOptions.includes(option.Id) ? 'selected' : ''
                                    }`}
                                    onClick={() => handleOptionSelect(
                                        option.Id,
                                        currentQuestion.QuestionType === 'MultipleChoice'
                                    )}
                                >
                                    <div className="option-checkbox">
                                        {currentQuestion.QuestionType === 'MultipleChoice' ? (
                                            <input
                                                type="checkbox"
                                                checked={currentAnswer?.selectedOptions.includes(option.Id)}
                                                readOnly
                                            />
                                        ) : (
                                            <input
                                                type="radio"
                                                checked={currentAnswer?.selectedOptions.includes(option.Id)}
                                                readOnly
                                            />
                                        )}
                                    </div>
                                    <span className="option-text">{option.Text}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="question-navigation">
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="nav-button"
                    >
                        ← Prethodno
                    </button>

                    {currentQuestionIndex === quiz.Questions.length - 1 ? (
                        <button onClick={handleSubmitQuiz} className="submit-button" disabled={submitting}>
                            {submitting ? 'Slanje...' : 'Završi kviz'}
                        </button>
                    ) : (
                        <button onClick={handleNextQuestion} className="nav-button">
                            Sledeće →
                        </button>
                    )}
                </div>
            </div>

            <div className="questions-overview">
                <h3>Pregled pitanja</h3>
                <div className="question-dots">
                    {quiz.Questions.map((q, index) => {
                        const answer = answers.find(a => a.questionId === q.Id);
                        const isAnswered = answer && (
                            answer.selectedOptions.length > 0 ||
                            (answer.textAnswer && answer.textAnswer.trim() !== '')
                        );
                        return (
                            <button
                                key={q.Id}
                                className={`question-dot ${index === currentQuestionIndex ? 'current' : ''} ${
                                    isAnswered ? 'answered' : ''
                                }`}
                                onClick={() => handleQuestionJump(index)}
                                title={`Pitanje ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TakeQuiz;
