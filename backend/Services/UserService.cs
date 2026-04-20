using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync()
        {
            var users = await _context.TmUsers
                .Select(u => new UserDto
                {
                    NUserId = u.Id,
                    SUserName = u.UserName,
                    IsActive = u.IsActive
                })
                .ToListAsync();

            return users;
        }
    }
}
