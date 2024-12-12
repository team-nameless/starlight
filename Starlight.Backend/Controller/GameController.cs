using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Starlight.Backend.Controller.Request;

namespace Starlight.Backend.Controller;

[Route("api/game")]
[ApiController]
public class GameController : ControllerBase
{
    /// <summary>
    ///     Starts a game.
    /// </summary>
    [HttpPost("start")]
    [Authorize]
    public ActionResult StartGame([FromBody] GameStartRequest _)
    {
        return Ok();
    }
}