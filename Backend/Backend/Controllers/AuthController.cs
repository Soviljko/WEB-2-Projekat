using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {

        public readonly IUserService userService;

        public AuthController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(UserRegisterDTO dto)
        {
            try
            {
                return await userService.RegisterAsync(dto); 
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(UserLoginDTO dto)
        {
            try
            {
                return await userService.LoginAsync(dto);
            }
            catch(Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("logged-in-user")]
        public ActionResult GetCurrentUser()
        {
            var username = User.Identity?.Name ?? "Anonymous";

            var roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            return Ok(new
            {
                Username = username,
                Roles = roles
            });
        }
    }
}
