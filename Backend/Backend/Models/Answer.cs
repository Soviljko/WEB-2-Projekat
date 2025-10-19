namespace Backend.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public int ResultId { get; set; }
        public int QuestionId { get; set; }
        public bool IsCorrectAnswer { get; set; }
        public string? ChosenOptionIds { get; set; }
        public string? EnteredText { get; set; } // Textual answers

        public Result Result { get; set; }
        public Question? Question { get; set; }
    }
}
