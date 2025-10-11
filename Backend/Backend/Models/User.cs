namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string? ImagePath { get; set; }

        public string Role { get; set; } = "User"; // User is default

        public ICollection<Result> Results { get; set; } = new List<Result>();
    }
}
