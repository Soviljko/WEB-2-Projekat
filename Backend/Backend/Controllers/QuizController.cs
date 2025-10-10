using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService quizService;

        public QuizController(IQuizService quizService)
        {
            this.quizService = quizService;
        }

        // POST: api/quiz
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<QuizResponseDTO>> CreateQuiz([FromBody] QuizCreateDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var quiz = await quizService.CreateQuizAsync(dto);
                return CreatedAtAction(nameof(GetQuizById), new { id = quiz.Id }, quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/quiz
        [HttpGet]
        public async Task<ActionResult<List<QuizSummaryDTO>>> GetAllQuizzes()
        {
            try
            {
                var quizzes = await quizService.GetAllQuizzesAsync();
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizResponseDTO>> GetQuizById(int id)
        {
            try
            {
                var quiz = await quizService.GetQuizByIdAsync(id);

                if (quiz == null)
                {
                    return NotFound(new { message = "Quiz not found" });
                }

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/quiz/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<List<QuizSummaryDTO>>> GetQuizzesByCategory(string category)
        {
            try
            {
                var quizzes = await quizService.GetQuizzesByCategoryAsync(category);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // GET: api/quiz/difficulty/{difficulty}
        [HttpGet("difficulty/{difficulty}")]
        public async Task<ActionResult<List<QuizSummaryDTO>>> GetQuizzesByDifficulty(string difficulty)
        {
            try
            {
                var quizzes = await quizService.GetQuizzesByDifficultyAsync(difficulty);
                return Ok(quizzes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // PUT: api/quiz/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<QuizResponseDTO>> UpdateQuiz(int id, [FromBody] QuizUpdateDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var quiz = await quizService.UpdateQuizAsync(id, dto);

                if (quiz == null)
                {
                    return NotFound(new { message = "Quiz not found" });
                }

                return Ok(quiz);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        // DELETE: api/quiz/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteQuiz(int id)
        {
            try
            {
                var result = await quizService.DeleteQuizAsync(id);

                if (!result)
                {
                    return NotFound(new { message = "Quiz not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }
    }
}
