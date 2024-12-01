using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Starlight.Backend.Controller;

[Route("/api/score")]
[ApiController]
public class ScoreController : ControllerBase
{
    /// <summary>
    ///     Get the most recent score of this player.
    /// </summary>
    [HttpGet("recent")]
    [Authorize]
    public ActionResult GetMostRecent()
    {
        return Ok();
    }
    
    /// <summary>
    ///     Get the results of a specific song.
    /// </summary>
    /// <param name="songId">Song ID to retrieve.</param>
    [HttpGet("{songId:long}")]
    [Authorize]
    public ActionResult GetScore(ulong songId)
    {
        return Ok();
    }
    
    /// <summary>
    ///     Upload the score.
    /// </summary>
    /// <param name="songId">Song ID to submit.</param>
    [HttpPut("{songId:long}")]
    [Authorize]
    public ActionResult UploadScore(ulong songId)
    {
        return Ok();
    }
    
    /// <summary>
    ///     Get the best score belong to that song ID.
    /// </summary>
    /// <param name="songId">Song ID to retrieve.</param>
    [HttpGet("{songId:long}/best")]
    [Authorize]
    public ActionResult GetSpecificBestScore(ulong songId)
    {
        return Ok();
    }
    
    /// <summary>
    ///     Get the recent score belong to that song ID.
    /// </summary>
    /// <param name="songId">Song ID to retrieve.</param>
    [HttpGet("{songId:long}/recent")]
    [Authorize]
    public ActionResult GetSpecificRecentScore(ulong songId)
    {
        return Ok();
    }
}