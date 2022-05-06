using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext :DbContext
    {
    public DataContext(DbContextOptions options) : base(options)
    {
        
    }
        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }

        protected override void OnModelCreating(ModelBuilder bilder)
        {
            base.OnModelCreating(bilder);

            bilder.Entity<UserLike>()
            .HasKey(k => new { k.LikedUserId, k.SourceUserId});

            bilder.Entity<UserLike>()
            .HasOne(u => u.SourceUser)
            .WithMany(u => u.LikedUsers) //appuser
            .HasForeignKey(u => u.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);
            
            bilder.Entity<UserLike>()
            .HasOne(u => u.LikedUser)
            .WithMany(u => u.LikedByUsers) //appuser
            .HasForeignKey(u => u.LikedUserId)
            .OnDelete(DeleteBehavior.Cascade);
        }
    
    }

  
}