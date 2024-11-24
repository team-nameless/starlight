using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("api/game")]
[ApiController]
public class GameController : ControllerBase
{
    private GameDatabaseService _gameDatabase;

    public GameController(GameDatabaseService gameDatabase)
    {
        _gameDatabase = gameDatabase;
    }
    
    /// <summary>
    ///     Starts a game.
    /// </summary>
    [HttpPost("start")]
    [Authorize]
    public async Task<ActionResult> StartGame([FromBody] GameStartRequest request)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        var player = await userManager.GetUserAsync(User);

        var foundPlayer = await _gameDatabase.Users.FirstAsync(p => p.SequenceNumber == player!.SequenceNumber);

        foundPlayer.RecentlyPlayedSong = request.SongId;

        await _gameDatabase.SaveChangesAsync();
        return Ok();
    }
}