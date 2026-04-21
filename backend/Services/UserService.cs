using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data.Context;
using Infrastructure.Data.Entities;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly WebAppEntity _context;

        public UserService(WebAppEntity context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetUsersAsync()
        {
            var users = await _context.TmUsers
                .Select(u => new UserDto
                {
                    NUserId = u.nUserId,
                    SUserName = u.sUserName,
                    IsActive = u.isActive
                })
                .ToListAsync();

            return users;
        }
    }
}
