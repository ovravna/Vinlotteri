using System.ComponentModel.DataAnnotations.Schema;

namespace Vinlotteri.Database;

public class Ticket
{
    public int Id { get; set; }
    public int Number { get; set; }
    public User User { get; set; }
}