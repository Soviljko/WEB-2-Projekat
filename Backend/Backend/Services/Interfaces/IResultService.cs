using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IResultService
    {
        Task<ResultResponseDTO> SubmitQuizResultAsync(int userId, ResultSubmitDTO dto);
        Task<ResultResponseDTO?> GetResultByIdAsync(int resultId);
        Task<List<ResultResponseDTO>> GetUserResultsAsync(int userId);
        Task<List<ResultResponseDTO>> GetQuizResultsAsync(int quizId);
        Task<List<ResultResponseDTO>> GetTopResultsAsync(int quizId, int count = 10);
        Task<List<ResultResponseDTO>> GetAllResultsAsync();
    }
}
