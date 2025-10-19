import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz, QuizCreateRequest, QuestionCreateRequest, OptionCreateRequest } from '../services/QuizService.ts';
import '../styles/CreateQuiz.css';

const CreateQuiz: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<QuizCreateRequest>({
        Title: '',
        Description: '',
        Category: '',
        Difficulty: 'Easy',
        LimitTime: 600,
        Questions: []
    });

    const [currentQuestion, setCurrentQuestion] = useState<QuestionCreateRequest>({
        Text: '',
        QuestionType: 'SingleChoice',
        Points: 10,
        ExpectedAnswer: '',
        Options: []
    });

    const [currentOption, setCurrentOption] = useState<OptionCreateRequest>({
        Text: '',
        IsCorrect: false
    });

    const [error, setError] = useState<string | null>(null);

    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'LimitTime' ? parseInt(value) : value
        });
    };

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentQuestion({
            ...currentQuestion,
            [name]: name === 'Points' ? parseInt(value) : value
        });
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setCurrentOption({
            ...currentOption,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const addOption = () => {
        if (!currentOption.Text.trim()) {
            alert('Option text cannot be empty');
            return;
        }
        setCurrentQuestion({
            ...currentQuestion,
            Options: [...currentQuestion.Options, currentOption]
        });
        setCurrentOption({ Text: '', IsCorrect: false });
    };

    const removeOption = (index: number) => {
        setCurrentQuestion({
            ...currentQuestion,
            Options: currentQuestion.Options.filter((_, i) => i !== index)
        });
    };

    const addQuestion = () => {
        if (!currentQuestion.Text.trim()) {
            alert('Question text cannot be empty');
            return;
        }

        if (currentQuestion.QuestionType !== 'TextAnswer' && currentQuestion.Options.length === 0) {
            alert('Please add at least one option');
            return;
        }

        setFormData({
            ...formData,
            Questions: [...formData.Questions, currentQuestion]
        });

        setCurrentQuestion({
            Text: '',
            QuestionType: 'SingleChoice',
            Points: 10,
            ExpectedAnswer: '',
            Options: []
        });
    };

    const removeQuestion = (index: number) => {
        setFormData({
            ...formData,
            Questions: formData.Questions.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.Title.trim()) {
            setError('Title is required');
            return;
        }

        if (formData.Questions.length === 0) {
            setError('Please add at least one question');
            return;
        }

        try {
            await createQuiz(formData);
            alert('Quiz created successfully!');
            navigate('/admin/quizzes');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create quiz');
            console.error('Error creating quiz:', err);
        }
    };

    return (
        <div className="create-quiz-container">
            <h1>Create New Quiz</h1>
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <h2>Quiz Information</h2>
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            name="Title"
                            value={formData.Title}
                            onChange={handleQuizChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="Description"
                            value={formData.Description}
                            onChange={handleQuizChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category *</label>
                            <input
                                type="text"
                                name="Category"
                                value={formData.Category}
                                onChange={handleQuizChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Difficulty *</label>
                            <select
                                name="Difficulty"
                                value={formData.Difficulty}
                                onChange={handleQuizChange}
                                required
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Time Limit (seconds) *</label>
                            <input
                                type="number"
                                name="LimitTime"
                                value={formData.LimitTime}
                                onChange={handleQuizChange}
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Questions ({formData.Questions.length})</h2>

                    {formData.Questions.map((q, index) => (
                        <div key={index} className="question-preview">
                            <div className="question-preview-header">
                                <strong>Q{index + 1}: {q.Text}</strong>
                                <button type="button" onClick={() => removeQuestion(index)} className="btn-remove">
                                    Remove
                                </button>
                            </div>
                            <div className="question-preview-meta">
                                Type: {q.QuestionType} | Points: {q.Points}
                            </div>
                            {q.Options.length > 0 && (
                                <ul className="options-preview">
                                    {q.Options.map((opt, i) => (
                                        <li key={i} className={opt.IsCorrect ? 'correct' : ''}>
                                            {opt.Text} {opt.IsCorrect && '✓'}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    <div className="add-question-form">
                        <h3>Add New Question</h3>
                        <div className="form-group">
                            <label>Question Text *</label>
                            <textarea
                                name="Text"
                                value={currentQuestion.Text}
                                onChange={handleQuestionChange}
                                rows={2}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    name="QuestionType"
                                    value={currentQuestion.QuestionType}
                                    onChange={handleQuestionChange}
                                >
                                    <option value="SingleChoice">Single Choice</option>
                                    <option value="MultipleChoice">Multiple Choice</option>
                                    <option value="TrueFalse">True/False</option>
                                    <option value="TextAnswer">Text Answer</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Points *</label>
                                <input
                                    type="number"
                                    name="Points"
                                    value={currentQuestion.Points}
                                    onChange={handleQuestionChange}
                                    min="1"
                                />
                            </div>
                        </div>

                        {currentQuestion.QuestionType === 'TextAnswer' ? (
                            <div className="form-group">
                                <label>Expected Answer</label>
                                <input
                                    type="text"
                                    name="ExpectedAnswer"
                                    value={currentQuestion.ExpectedAnswer}
                                    onChange={handleQuestionChange}
                                />
                            </div>
                        ) : (
                            <div className="options-section">
                                <h4>Options</h4>
                                {currentQuestion.Options.map((opt, index) => (
                                    <div key={index} className="option-item">
                                        <span>{opt.Text} {opt.IsCorrect && '✓'}</span>
                                        <button type="button" onClick={() => removeOption(index)} className="btn-remove-small">
                                            ×
                                        </button>
                                    </div>
                                ))}

                                <div className="add-option-form">
                                    <input
                                        type="text"
                                        name="Text"
                                        value={currentOption.Text}
                                        onChange={handleOptionChange}
                                        placeholder="Option text"
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="IsCorrect"
                                            checked={currentOption.IsCorrect}
                                            onChange={handleOptionChange}
                                        />
                                        Correct
                                    </label>
                                    <button type="button" onClick={addOption} className="btn-add-option">
                                        Add Option
                                    </button>
                                </div>
                            </div>
                        )}

                        <button type="button" onClick={addQuestion} className="btn-add-question">
                            Add Question
                        </button>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/quizzes')} className="btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" className="btn-submit">
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
