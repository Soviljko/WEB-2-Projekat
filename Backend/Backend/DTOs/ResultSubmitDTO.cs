using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class ResultSubmitDTO
    {
        [Required]
        public int QuizId { get; set; }

        [Required]
        public int TimeSpent { get; set; } // Time spent in seconds

        [Required]
        public List<AnswerSubmitDTO> Answers { get; set; } = new List<AnswerSubmitDTO>();
    }

    public class AnswerSubmitDTO
    {
        [Required]
        public int QuestionId { get; set; }

        // For multiple choice questions
        public List<int>? SelectedOptionIds { get; set; }

        // For text answer questions
        public string? EnteredText { get; set; }
    }
}
