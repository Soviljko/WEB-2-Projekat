namespace Backend.DTOs
{
    public class QuizResponseDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public string Category { get; set; } = default!;
        public string Difficulty { get; set; } = default!;
        public int LimitTime { get; set; } // in seconds
        public List<QuestionResponseDTO> Questions { get; set; } = new List<QuestionResponseDTO>();
    }

    public class QuizSummaryDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public string Category { get; set; } = default!;
        public string Difficulty { get; set; } = default!;
        public int LimitTime { get; set; }
        public int QuestionCount { get; set; }
    }

    public class QuestionResponseDTO
    {
        public int Id { get; set; }
        public string Text { get; set; } = default!;
        public string QuestionType { get; set; } = default!;
        public int Points { get; set; }
        public string? ExpectedAnswer { get; set; }
        public List<OptionResponseDTO> Options { get; set; } = new List<OptionResponseDTO>();
    }

    public class OptionResponseDTO
    {
        public int Id { get; set; }
        public string Text { get; set; } = default!;
        public bool IsCorrect { get; set; }
    }
}
