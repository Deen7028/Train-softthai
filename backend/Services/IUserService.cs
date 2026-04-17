using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;

namespace backend.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetUsersAsync();
    }
}
