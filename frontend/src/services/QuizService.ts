import api from '../api/api.ts';

export interface QuizCreateRequest {
    Title: string;
    Description?: string;
    Category: string;
    Difficulty: string;
    LimitTime: number;
    Questions: QuestionCreateRequest[];
}

export interface QuestionCreateRequest {
    Text: string;
    QuestionType: string;
    Points: number;
    ExpectedAnswer?: string;
    Options: OptionCreateRequest[];
}

export interface OptionCreateRequest {
    Text: string;
    IsCorrect: boolean;
}

export interface QuizResponse {
    Id: number;
    Title: string;
    Description?: string;
    Category: string;
    Difficulty: string;
    LimitTime: number;
    Questions: QuestionResponse[];
}

export interface QuestionResponse {
    Id: number;
    Text: string;
    QuestionType: string;
    Points: number;
    ExpectedAnswer?: string;
    Options: OptionResponse[];
}

export interface OptionResponse {
    Id: number;
    Text: string;
    IsCorrect: boolean;
}

export interface QuizSummary {
    Id: number;
    Title: string;
    Description?: string;
    Category: string;
    Difficulty: string;
    LimitTime: number;
    QuestionCount: number;
}

export const createQuiz = async (data: QuizCreateRequest): Promise<QuizResponse> => {
    const response = await api.post('/api/quiz', data);
    return response.data;
};

export const getAllQuizzes = async (): Promise<QuizSummary[]> => {
    const response = await api.get('/api/quiz');
    return response.data;
};

export const getQuizById = async (id: number): Promise<QuizResponse> => {
    const response = await api.get(`/api/quiz/${id}`);
    return response.data;
};

export const updateQuiz = async (id: number, data: Partial<QuizCreateRequest>): Promise<QuizResponse> => {
    const response = await api.put(`/api/quiz/${id}`, data);
    return response.data;
};

export const deleteQuiz = async (id: number): Promise<void> => {
    await api.delete(`/api/quiz/${id}`);
};

export const getQuizzesByCategory = async (category: string): Promise<QuizSummary[]> => {
    const response = await api.get(`/api/quiz/category/${category}`);
    return response.data;
};

export const getQuizzesByDifficulty = async (difficulty: string): Promise<QuizSummary[]> => {
    const response = await api.get(`/api/quiz/difficulty/${difficulty}`);
    return response.data;
};
