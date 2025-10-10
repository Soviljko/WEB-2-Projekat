using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IQuizService
    {
        // Create
        Task<QuizResponseDTO> CreateQuizAsync(QuizCreateDTO dto);

        // Read
        Task<QuizResponseDTO?> GetQuizByIdAsync(int id);
        Task<List<QuizSummaryDTO>> GetAllQuizzesAsync();
        Task<List<QuizSummaryDTO>> GetQuizzesByCategoryAsync(string category);
        Task<List<QuizSummaryDTO>> GetQuizzesByDifficultyAsync(string difficulty);

        // Update
        Task<QuizResponseDTO?> UpdateQuizAsync(int id, QuizUpdateDTO dto);

        // Delete
        Task<bool> DeleteQuizAsync(int id);
    }
}
