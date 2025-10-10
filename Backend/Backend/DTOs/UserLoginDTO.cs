namespace Backend.DTOs
{
    public class UserLoginDTO
    {
        public string EmailOrUsername { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}

