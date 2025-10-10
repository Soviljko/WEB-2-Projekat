using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class QuestionCreateDTO
    {
        [Required(ErrorMessage = "Question text is required")]
        [MaxLength(1000, ErrorMessage = "Question text cannot exceed 1000 characters")]
        public string Text { get; set; } = default!;

        [Required(ErrorMessage = "Question type is required")]
        [RegularExpression("^(SingleChoice|MultipleChoice|TrueFalse|TextAnswer)$",
            ErrorMessage = "Invalid question type")]
        public string QuestionType { get; set; } = default!;

        [Required(ErrorMessage = "Points are required")]
        [Range(1, int.MaxValue, ErrorMessage = "Points must be greater than 0")]
        public int Points { get; set; }

        // For TextAnswer questions
        public string? ExpectedAnswer { get; set; }

        // For SingleChoice, MultipleChoice, TrueFalse questions
        public List<OptionCreateDTO> Options { get; set; } = new List<OptionCreateDTO>();
    }

    public class OptionCreateDTO
    {
        [Required(ErrorMessage = "Option text is required")]
        [MaxLength(500, ErrorMessage = "Option text cannot exceed 500 characters")]
        public string Text { get; set; } = default!;

        [Required(ErrorMessage = "IsCorrect flag is required")]
        public bool IsCorrect { get; set; }
    }
}
