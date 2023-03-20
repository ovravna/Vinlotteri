namespace Vinlotteri.Database;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } 
    public int Balance { get; set; }
    public ICollection<Ticket> Tickets { get; set; }
}