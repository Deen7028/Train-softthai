using Infrastructure.Data.WebApp.Entities;
using backend.Services;

namespace backend.Interfaces
{
    public interface IUserService
    {
        IEnumerable<tbPosts> GetAllPosts();
        IEnumerable<tbLocation> GetAllLocation();
        IEnumerable<tbStatus> GetAllStatus();
        IEnumerable<tbTypePost> GetAllTypePost();
        tbPosts? GetUserById(int id);
        tbPosts SaveUser(tbPosts user);
        tbPosts? DeleteUser(int id);
    }
}