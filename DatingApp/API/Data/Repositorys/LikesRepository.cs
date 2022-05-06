using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositorys
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;
         public LikesRepository(DataContext context)
        {
           _context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
           return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        {
            IQueryable<AppUser> users;
            var likes = _context.Likes.AsQueryable();
            if(predicate == "liked")
            {
                likes = likes.Where(l => l.SourceUserId == userId);
                users = likes.Select(l => l.LikedUser);
            }
            else
            {
                likes = likes.Where(like => like.LikedUserId == userId); //filter
                users = likes.Select(like => like.SourceUser);
            }
            return await users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            }).ToListAsync();
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
            .Include(u => u.LikedUsers)
            .FirstOrDefaultAsync(u => u.Id == userId);
        }
    }
}