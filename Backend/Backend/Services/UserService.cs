using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;

        public UserService(ApplicationDbContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }

        public async Task<UserDTO> LoginAsync(UserLoginDTO dto)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Username == dto.EmailOrUsername || u.Email == dto.EmailOrUsername);

            if(user == null)
            {
                throw new Exception("User not found(invalid input credentials)");
            }

            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if(!isValid)
            {
                throw new Exception("Wrong password, try again.");
            }

            return new UserDTO
            {
                Username = user.Username,
                Email = user.Email,
                Token = CreateToken(user)
            };
        }

        public async Task<UserDTO> RegisterAsync(UserRegisterDTO dto)
        {
            if(await context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
            {
                throw new Exception("User with entered username/email already exists.");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                ImagePath = dto.ImageUrl,
                Role = "User"
            };

            context.Users.Add(user);

            await context.SaveChangesAsync();

            return new UserDTO
            {
                Username = user.Username,
                Email = user.Email,
                Token = CreateToken(user)
            };
        }

        // Creating JWT token
        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(5), signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
