namespace Backend.Models
{
    public class Result
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int QuizId { get; set; }
        public int CorrectCount { get; set; }         
        public double SuccessRate { get; set; }       
        public TimeSpan TimeSpent { get; set; }       
        public DateTime SubmittedAt { get; set; }     
        public int TotalPoints { get; set; }          

        public User User { get; set; } // Participant
        public Quiz Quiz { get; set; } 

        public ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
