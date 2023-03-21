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

    [HttpPost("resetdraw")]
    public async Task<string> ResetDraw()
    {
        await _databaseContext.Ticket.ForEachAsync(t => t.HasBeenDrawn = false);

        await _databaseContext.SaveChangesAsync();
        return "OK";
    }
    
    [HttpPost("resettickets")]
    public async Task<string> ResetTickets()
    {
        var tickets = _databaseContext.Ticket.ToArray();
        _databaseContext.Ticket.RemoveRange(tickets);

        await _databaseContext.SaveChangesAsync();
        return "OK";
    }
    
    [HttpPost("resetusers")]
    public async Task<string> ResetUsers()
    {
        var users = _databaseContext.User.ToArray();
        _databaseContext.User.RemoveRange(users);

        await _databaseContext.SaveChangesAsync();
        return "OK";
    }
    [HttpPost("draw")]
    public Ticket? Draw()
    {
        var tickets = _databaseContext.Ticket
            .Include(t => t.User)
            .Where(t => !t.HasBeenDrawn).ToList();

        if (tickets.Count == 0)
            return null;
        
        var index = Random.Shared.Next(tickets.Count);
        var ticket = tickets[index];
        
        ticket.HasBeenDrawn = true;
        _databaseContext.SaveChanges();
        return ticket;
    }

    [Route("/error")]
    public string Error()
    {
        return "An error occured";
    }
}