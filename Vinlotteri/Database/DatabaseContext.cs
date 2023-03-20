using Microsoft.EntityFrameworkCore;

namespace Vinlotteri.Database;

public class DatabaseContext: DbContext
{
    
    public DatabaseContext(DbContextOptions<DatabaseContext> options): base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Name)
            .IsUnique();

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tickets);

        modelBuilder.Entity<Ticket>()
            .HasIndex(t => t.Number)
            .IsUnique();

    }

    public virtual DbSet<User> User { get; set; }
    public virtual DbSet<Ticket> Ticket { get; set; }
}