using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
            IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
            IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                        .HasMany(x => x.UserRoles)
                        .WithOne(x => x.User)
                        .HasForeignKey(x => x.UserId)
                        .IsRequired();

            modelBuilder.Entity<AppRole>()
                        .HasMany(x => x.UserRoles)
                        .WithOne(x => x.Role)
                        .HasForeignKey(x => x.RoleId)
                        .IsRequired();

            modelBuilder.Entity<UserLike>()
                        .HasKey(k => new { k.SourceUserId, k.LikedUserId });

            // SourceUser can like many other users
            // For SQL server , we should use DeleteBehavior.Cascade
            // as DeleteBehavior.None
            modelBuilder.Entity<UserLike>()
                        .HasOne(s => s.SourceUser)
                        .WithMany(l => l.LikedUsers)
                        .HasForeignKey(s => s.SourceUserId)
                        .OnDelete(DeleteBehavior.Cascade);

            // LikedUser can have many likedByuser 
            modelBuilder.Entity<UserLike>()
                        .HasOne(s => s.LikedUser)
                        .WithMany(l => l.LikedByUsers)
                        .HasForeignKey(s => s.LikedUserId)
                        .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Message>()
                        .HasOne(u => u.Recipient)
                        .WithMany(m => m.MessageReceived)
                        .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                        .HasOne(u => u.Sender)
                        .WithMany(m => m.MessageSent)
                        .OnDelete(DeleteBehavior.Restrict);

        }
    }
}