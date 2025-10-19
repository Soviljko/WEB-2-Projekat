namespace Backend.DTOs
{
    public class ResultResponseDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = default!;
        public int QuizId { get; set; }
        public string QuizTitle { get; set; } = default!;
        public int CorrectCount { get; set; }
        public int TotalQuestions { get; set; }
        public double SuccessRate { get; set; }
        public TimeSpan TimeSpent { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int TotalPoints { get; set; }
        public int MaxPoints { get; set; }

        public List<AnswerDetailDTO> Answers { get; set; } = new List<AnswerDetailDTO>();
    }

    public class AnswerDetailDTO
    {
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = default!;
        public int Points { get; set; }
        public bool IsCorrect { get; set; }
        public List<int>? SelectedOptionIds { get; set; }
        public string? EnteredText { get; set; }
        public List<OptionDetailDTO> Options { get; set; } = new List<OptionDetailDTO>();
    }

    public class OptionDetailDTO
    {
        public int Id { get; set; }
        public string Text { get; set; } = default!;
        public bool IsCorrect { get; set; }
    }
}
