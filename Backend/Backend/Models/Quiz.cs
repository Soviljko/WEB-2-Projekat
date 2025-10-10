namespace Backend.Models
{
    public class Quiz
    { 
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string Description { get; set; } = default!;
        public string Category { get; set; } = default!;
        public string Difficulty { get; set; } = default!; // Easy, Medium and Hard

        public int LimitTime { get; set; } // Seconds

        public ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
