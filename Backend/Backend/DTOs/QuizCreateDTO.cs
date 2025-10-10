using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class QuizCreateDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; } = default!;

        [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        [MaxLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
        public string Category { get; set; } = default!;

        [Required(ErrorMessage = "Difficulty is required")]
        [RegularExpression("^(Easy|Medium|Hard)$", ErrorMessage = "Difficulty must be Easy, Medium, or Hard")]
        public string Difficulty { get; set; } = default!;

        [Required(ErrorMessage = "Time limit is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Time limit must be greater than 0")]
        public int LimitTime { get; set; } // in seconds

        public List<QuestionCreateDTO> Questions { get; set; } = new List<QuestionCreateDTO>();
    }
}
