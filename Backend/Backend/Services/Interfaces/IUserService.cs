using Backend.DTOs;

namespace Backend.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO> RegisterAsync(UserRegisterDTO dto);
        Task<UserDTO> LoginAsync(UserLoginDTO dto);

    }
}
