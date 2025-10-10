using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class QuizService : IQuizService
    {
        private readonly ApplicationDbContext context;

        public QuizService(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<QuizResponseDTO> CreateQuizAsync(QuizCreateDTO dto)
        {
            var quiz = new Quiz
            {
                Title = dto.Title,
                Description = dto.Description,
                Category = dto.Category,
                Difficulty = dto.Difficulty,
                LimitTime = dto.LimitTime,
                Questions = dto.Questions.Select(q => new Question
                {
                    Text = q.Text,
                    QuestionType = q.QuestionType,
                    Points = q.Points,
                    ExpectedAnswer = q.ExpectedAnswer,
                    IsMultipleChoice = q.QuestionType == "MultipleChoice",
                    Options = q.Options.Select(o => new Option
                    {
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            context.Quizzes.Add(quiz);
            await context.SaveChangesAsync();

            return await GetQuizByIdAsync(quiz.Id) ?? throw new Exception("Failed to create quiz");
        }

        public async Task<QuizResponseDTO?> GetQuizByIdAsync(int id)
        {
            var quiz = await context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return null;

            return new QuizResponseDTO
            {
                Id = quiz.Id,
                Title = quiz.Title,
                Description = quiz.Description,
                Category = quiz.Category,
                Difficulty = quiz.Difficulty,
                LimitTime = quiz.LimitTime,
                Questions = quiz.Questions.Select(q => new QuestionResponseDTO
                {
                    Id = q.Id,
                    Text = q.Text,
                    QuestionType = q.QuestionType,
                    Points = q.Points,
                    ExpectedAnswer = q.ExpectedAnswer,
                    Options = q.Options.Select(o => new OptionResponseDTO
                    {
                        Id = o.Id,
                        Text = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };
        }

        public async Task<List<QuizSummaryDTO>> GetAllQuizzesAsync()
        {
            var quizzes = await context.Quizzes
                .Include(q => q.Questions)
                .ToListAsync();

            return quizzes.Select(q => new QuizSummaryDTO
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                Category = q.Category,
                Difficulty = q.Difficulty,
                LimitTime = q.LimitTime,
                QuestionCount = q.Questions.Count
            }).ToList();
        }

        public async Task<List<QuizSummaryDTO>> GetQuizzesByCategoryAsync(string category)
        {
            var quizzes = await context.Quizzes
                .Include(q => q.Questions)
                .Where(q => q.Category.ToLower() == category.ToLower())
                .ToListAsync();

            return quizzes.Select(q => new QuizSummaryDTO
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                Category = q.Category,
                Difficulty = q.Difficulty,
                LimitTime = q.LimitTime,
                QuestionCount = q.Questions.Count
            }).ToList();
        }

        public async Task<List<QuizSummaryDTO>> GetQuizzesByDifficultyAsync(string difficulty)
        {
            var quizzes = await context.Quizzes
                .Include(q => q.Questions)
                .Where(q => q.Difficulty.ToLower() == difficulty.ToLower())
                .ToListAsync();

            return quizzes.Select(q => new QuizSummaryDTO
            {
                Id = q.Id,
                Title = q.Title,
                Description = q.Description,
                Category = q.Category,
                Difficulty = q.Difficulty,
                LimitTime = q.LimitTime,
                QuestionCount = q.Questions.Count
            }).ToList();
        }

        public async Task<QuizResponseDTO?> UpdateQuizAsync(int id, QuizUpdateDTO dto)
        {
            var quiz = await context.Quizzes.FindAsync(id);

            if (quiz == null)
                return null;

            quiz.Title = dto.Title;
            quiz.Description = dto.Description;
            quiz.Category = dto.Category;
            quiz.Difficulty = dto.Difficulty;
            quiz.LimitTime = dto.LimitTime;

            await context.SaveChangesAsync();

            return await GetQuizByIdAsync(id);
        }

        public async Task<bool> DeleteQuizAsync(int id)
        {
            var quiz = await context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return false;

            context.Quizzes.Remove(quiz);
            await context.SaveChangesAsync();

            return true;
        }
    }
}
