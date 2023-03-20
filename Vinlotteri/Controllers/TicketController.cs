using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vinlotteri.Database;

namespace Vinlotteri.Controllers;

[ApiController]
[Route("[controller]")]
public class TicketController
{
    private readonly DatabaseContext _databaseContext;

    public TicketController(DatabaseContext databaseContext)
    {
        _databaseContext = databaseContext;
    }


    [HttpGet]
    public Ticket[] Get([FromQuery] string username)
    {
        return _databaseContext.Ticket
            .Include(t => t.User)
            .Where(t => t.User.Name == username)
            .ToArray();
    }

    [HttpPost]
    public string AddTicket(
        [FromQuery] string name,
        [FromQuery] int number
    )
    {
        _databaseContext.User
            .Include(u => u.Tickets)
            .FirstOrDefault(u => u.Name == name)
            ?.Tickets.Add(new Ticket
            {
                Number = number,
            });

        _databaseContext.SaveChanges();

        return "OK";
    }


    [HttpGet("users")]
    public ICollection<User> GetUsers()
    {
        return _databaseContext.User
            .Include(u => u.Tickets)
            .ToList();
    }
    
    [HttpGet("user")]
    public User? GetUser(
        [FromQuery] string name
    )
    {
        return _databaseContext.User
            .Include(u => u.Tickets)
            .FirstOrDefault(u => u.Name == name);
    }

    [HttpPost("user")]
    public void AddUser(
        [FromQuery] string name,
        [FromQuery] int balance = 100
    )
    {
        _databaseContext.User.Add(new User
        {
            Balance = balance,
            Name = name
        });

        _databaseContext.SaveChanges();
    }

    [Route("/error")]
    public string Error()
    {
        return "An error occured";
    }
}