using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ResultService : IResultService
    {
        private readonly ApplicationDbContext _context;

        public ResultService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ResultResponseDTO> SubmitQuizResultAsync(int userId, ResultSubmitDTO dto)
        {
            // Load quiz with questions and options
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null)
            {
                throw new Exception("Quiz not found");
            }

            // Calculate results
            int correctCount = 0;
            int totalPoints = 0;
            int maxPoints = quiz.Questions.Sum(q => q.Points);
            var answerEntities = new List<Answer>();

            foreach (var answerDto in dto.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answerDto.QuestionId);
                if (question == null) continue;

                bool isCorrect = false;
                int pointsEarned = 0;

                if (question.QuestionType == "TextAnswer")
                {
                    // Text answer validation
                    if (!string.IsNullOrWhiteSpace(question.ExpectedAnswer) &&
                        !string.IsNullOrWhiteSpace(answerDto.EnteredText))
                    {
                        isCorrect = question.ExpectedAnswer.Trim().Equals(
                            answerDto.EnteredText.Trim(),
                            StringComparison.OrdinalIgnoreCase
                        );
                    }
                }
                else
                {
                    // Multiple choice validation
                    var correctOptions = question.Options.Where(o => o.IsCorrect).Select(o => o.Id).ToList();
                    var selectedOptions = answerDto.SelectedOptionIds ?? new List<int>();

                    isCorrect = correctOptions.Count == selectedOptions.Count &&
                               !correctOptions.Except(selectedOptions).Any();
                }

                if (isCorrect)
                {
                    correctCount++;
                    pointsEarned = question.Points;
                    totalPoints += pointsEarned;
                }

                answerEntities.Add(new Answer
                {
                    QuestionId = question.Id,
                    IsCorrectAnswer = isCorrect,
                    ChosenOptionIds = answerDto.SelectedOptionIds != null
                        ? string.Join(",", answerDto.SelectedOptionIds)
                        : null,
                    EnteredText = answerDto.EnteredText
                });
            }

            // Calculate success rate
            double successRate = quiz.Questions.Count > 0
                ? (double)correctCount / quiz.Questions.Count * 100
                : 0;

            // Create result entity
            var result = new Result
            {
                UserId = userId,
                QuizId = dto.QuizId,
                CorrectCount = correctCount,
                SuccessRate = successRate,
                TimeSpent = TimeSpan.FromSeconds(dto.TimeSpent),
                SubmittedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc),
                TotalPoints = totalPoints
            };

            _context.Results.Add(result);
            await _context.SaveChangesAsync();

            // Associate answers with result
            foreach (var answer in answerEntities)
            {
                answer.ResultId = result.Id;
            }

            _context.Answers.AddRange(answerEntities);
            await _context.SaveChangesAsync();

            // Return response
            return await GetResultByIdAsync(result.Id)
                ?? throw new Exception("Failed to retrieve result");
        }

        public async Task<ResultResponseDTO?> GetResultByIdAsync(int resultId)
        {
            var result = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Include(r => r.Answers)
                .ThenInclude(a => a.Question)
                .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(r => r.Id == resultId);

            if (result == null) return null;

            return new ResultResponseDTO
            {
                Id = result.Id,
                UserId = result.UserId,
                Username = result.User.Username,
                QuizId = result.QuizId,
                QuizTitle = result.Quiz.Title,
                CorrectCount = result.CorrectCount,
                TotalQuestions = result.Quiz.Questions.Count,
                SuccessRate = result.SuccessRate,
                TimeSpent = result.TimeSpent,
                SubmittedAt = DateTime.SpecifyKind(result.SubmittedAt, DateTimeKind.Utc),
                TotalPoints = result.TotalPoints,
                MaxPoints = result.Quiz.Questions.Sum(q => q.Points),
                Answers = result.Answers.Select(a => new AnswerDetailDTO
                {
                    QuestionId = a.QuestionId,
                    QuestionText = a.Question.Text,
                    Points = a.Question.Points,
                    IsCorrect = a.IsCorrectAnswer,
                    SelectedOptionIds = !string.IsNullOrEmpty(a.ChosenOptionIds)
                        ? a.ChosenOptionIds.Split(',').Select(int.Parse).ToList()
                        : null,
                    EnteredText = a.EnteredText,
                    Options = a.Question.Options.Select(o => new OptionDetailDTO
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<List<ResultResponseDTO>> GetUserResultsAsync(int userId)
        {
            var results = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.SubmittedAt)
                .ToListAsync();

            return results.Select(r => new ResultResponseDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz.Title,
                CorrectCount = r.CorrectCount,
                TotalQuestions = r.Quiz.Questions.Count,
                SuccessRate = r.SuccessRate,
                TimeSpent = r.TimeSpent,
                SubmittedAt = DateTime.SpecifyKind(r.SubmittedAt, DateTimeKind.Utc),
                TotalPoints = r.TotalPoints,
                MaxPoints = r.Quiz.Questions.Sum(q => q.Points)
            }).ToList();
        }

        public async Task<List<ResultResponseDTO>> GetQuizResultsAsync(int quizId)
        {
            var results = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Where(r => r.QuizId == quizId)
                .OrderByDescending(r => r.TotalPoints)
                .ThenBy(r => r.TimeSpent)
                .ToListAsync();

            return results.Select(r => new ResultResponseDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz.Title,
                CorrectCount = r.CorrectCount,
                TotalQuestions = r.Quiz.Questions.Count,
                SuccessRate = r.SuccessRate,
                TimeSpent = r.TimeSpent,
                SubmittedAt = DateTime.SpecifyKind(r.SubmittedAt, DateTimeKind.Utc),
                TotalPoints = r.TotalPoints,
                MaxPoints = r.Quiz.Questions.Sum(q => q.Points)
            }).ToList();
        }

        public async Task<List<ResultResponseDTO>> GetTopResultsAsync(int quizId, int count = 10)
        {
            var results = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .Where(r => r.QuizId == quizId)
                .OrderByDescending(r => r.TotalPoints)
                .ThenBy(r => r.TimeSpent)
                .Take(count)
                .ToListAsync();

            return results.Select(r => new ResultResponseDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz.Title,
                CorrectCount = r.CorrectCount,
                TotalQuestions = r.Quiz.Questions.Count,
                SuccessRate = r.SuccessRate,
                TimeSpent = r.TimeSpent,
                SubmittedAt = DateTime.SpecifyKind(r.SubmittedAt, DateTimeKind.Utc),
                TotalPoints = r.TotalPoints,
                MaxPoints = r.Quiz.Questions.Sum(q => q.Points)
            }).ToList();
        }

        public async Task<List<ResultResponseDTO>> GetAllResultsAsync()
        {
            var results = await _context.Results
                .Include(r => r.User)
                .Include(r => r.Quiz)
                .OrderByDescending(r => r.SubmittedAt)
                .ToListAsync();

            return results.Select(r => new ResultResponseDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                Username = r.User.Username,
                QuizId = r.QuizId,
                QuizTitle = r.Quiz.Title,
                CorrectCount = r.CorrectCount,
                TotalQuestions = r.Quiz.Questions.Count,
                SuccessRate = r.SuccessRate,
                TimeSpent = r.TimeSpent,
                SubmittedAt = DateTime.SpecifyKind(r.SubmittedAt, DateTimeKind.Utc),
                TotalPoints = r.TotalPoints,
                MaxPoints = r.Quiz.Questions.Sum(q => q.Points)
            }).ToList();
        }
    }
}
