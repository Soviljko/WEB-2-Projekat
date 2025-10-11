namespace Backend.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string Text { get; set; } = default!;
        public string QuestionType { get; set; } = default!; // Single asnwer, multiple answer, True or false, Text answer

        public int Points { get; set; }
        public int QuizId { get; set; }
        public bool IsMultipleChoice { get; set; }
        public Quiz Quiz { get; set; } = default!;

        public ICollection<Option> Options { get; set; } = new List<Option>();
        public ICollection<Answer> Answers { get; set; } = new List<Answer>();

        public string? ExpectedAnswer { get; set; }
    }
}
