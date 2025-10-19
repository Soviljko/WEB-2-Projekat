using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ResultController : ControllerBase
    {
        private readonly IResultService _resultService;

        public ResultController(IResultService resultService)
        {
            _resultService = resultService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }
            return userId;
        }

        [HttpPost]
        public async Task<ActionResult<ResultResponseDTO>> SubmitQuizResult([FromBody] ResultSubmitDTO dto)
        {
            try
            {
                int userId = GetCurrentUserId();
                var result = await _resultService.SubmitQuizResultAsync(userId, dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResultResponseDTO>> GetResult(int id)
        {
            try
            {
                var result = await _resultService.GetResultByIdAsync(id);
                if (result == null)
                {
                    return NotFound(new { error = "Result not found" });
                }

                int userId = GetCurrentUserId();
                // Users can only view their own results, unless they're admin
                if (result.UserId != userId && !User.IsInRole("Admin"))
                {
                    return Forbid();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetUserResults()
        {
            try
            {
                int userId = GetCurrentUserId();
                var results = await _resultService.GetUserResultsAsync(userId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("quiz/{quizId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetQuizResults(int quizId)
        {
            try
            {
                var results = await _resultService.GetQuizResultsAsync(quizId);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("leaderboard/{quizId}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetLeaderboard(int quizId, [FromQuery] int count = 10)
        {
            try
            {
                var results = await _resultService.GetTopResultsAsync(quizId, count);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ResultResponseDTO>>> GetAllResults()
        {
            try
            {
                var results = await _resultService.GetAllResultsAsync();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
