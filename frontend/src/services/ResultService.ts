import api from '../api/api.ts';

export interface ResultSubmit {
    QuizId: number;
    TimeSpent: number;
    Answers: AnswerSubmit[];
}

export interface AnswerSubmit {
    QuestionId: number;
    SelectedOptionIds?: number[];
    EnteredText?: string;
}

export interface ResultResponse {
    Id: number;
    UserId: number;
    Username: string;
    QuizId: number;
    QuizTitle: string;
    CorrectCount: number;
    TotalQuestions: number;
    SuccessRate: number;
    TimeSpent: string; // TimeSpan from backend
    SubmittedAt: string;
    TotalPoints: number;
    MaxPoints: number;
    Answers: AnswerDetail[];
}

export interface AnswerDetail {
    QuestionId: number;
    QuestionText: string;
    Points: number;
    IsCorrect: boolean;
    SelectedOptionIds?: number[];
    EnteredText?: string;
    Options: OptionDetail[];
}

export interface OptionDetail {
    Id: number;
    Text: string;
    IsCorrect: boolean;
}

export const submitQuizResult = async (data: ResultSubmit): Promise<ResultResponse> => {
    const response = await api.post('/api/result', data);
    return response.data;
};

export const getResultById = async (id: number): Promise<ResultResponse> => {
    const response = await api.get(`/api/result/${id}`);
    return response.data;
};

export const getUserResults = async (): Promise<ResultResponse[]> => {
    const response = await api.get('/api/result/user');
    return response.data;
};

export const getQuizLeaderboard = async (quizId: number, count: number = 10): Promise<ResultResponse[]> => {
    const response = await api.get(`/api/result/leaderboard/${quizId}?count=${count}`);
    return response.data;
};

export const getAllResults = async (): Promise<ResultResponse[]> => {
    const response = await api.get('/api/result/all');
    return response.data;
};
