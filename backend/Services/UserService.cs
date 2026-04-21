using Infrastructure.Data.WebApp.Context;
using Infrastructure.Data.WebApp.Entities;
using Microsoft.EntityFrameworkCore;
using backend.Interfaces;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly WebAppEntity _context;

        public UserService(WebAppEntity context)
        {
            _context = context;
        }

        public IEnumerable<tbPosts> GetAllPosts()
            => _context.tbPosts.Where(w => w.isDeleted == false).ToList();

        public IEnumerable<tbLocation> GetAllLocation()
            => _context.tbLocation.ToList();

        public IEnumerable<tbStatus> GetAllStatus()
            => _context.tbStatus.ToList();

        public IEnumerable<tbTypePost> GetAllTypePost()
            => _context.tbTypePost.ToList();

        public tbPosts? GetUserById(int id)
            => _context.tbPosts.Find(id);

        public tbPosts SaveUser(tbPosts user)
        {
            var objUser = _context.tbPosts.FirstOrDefault(w => w.nId == user.nId);
            if (objUser == null)
            {
                objUser = new tbPosts();
                _context.tbPosts.Add(objUser);
            }
            
            objUser.sTitle = user.sTitle;
            objUser.sNote = user.sNote;
            objUser.dStartDate = user.dStartDate;
            objUser.dEndDate = user.dEndDate;
            objUser.nStatusId = user.nStatusId;
            objUser.nLocationId = user.nLocationId;
            objUser.nTypePostId = user.nTypePostId;

            _context.SaveChanges();
            return objUser;
        }

        public tbPosts? DeleteUser(int id)
        {
            var objUser = _context.tbPosts.Find(id);
            if (objUser != null)
            {
                objUser.isDeleted = true;
                _context.SaveChanges();
            }
            return objUser;
        }
    }
}