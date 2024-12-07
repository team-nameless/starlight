using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api/score")]
[ApiController]
public class ScoreController : ControllerBase
{
    private GameDatabaseService _gameDatabase;
    
    public ScoreController(GameDatabaseService gameDatabase)
    {
        _gameDatabase = gameDatabase;
    }
    
    /// <summary>
    ///     Get the most recent score of this player.
    /// </summary>
    [HttpGet("recent")]
    [Authorize]
    public async Task<ActionResult<Score>> GetMostRecent()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();

        var player = await signInManager.UserManager.GetUserAsync(HttpContext.User);

        var mostRecentScore = _gameDatabase.Scores
            .Include(s => s.Player)
            .Where(score => score.Player.SequenceNumber == player!.SequenceNumber)
            .AsNoTracking()
            .OrderByDescending(score => score.SubmissionDate);
        
        if (!mostRecentScore.Any()) return NoContent();
        
        return Ok(await mostRecentScore.FirstAsync());
    }

    /// <summary>
    ///     Upload the score. Reserved for in-game play.
    /// </summary>
    /// <param name="songId">Song ID to submit.</param>
    /// <param name="submission">Submission object</param>
    [HttpPost("{songId:long}")]
    [Authorize]
    public async Task<ActionResult> UploadScore(ulong songId, [FromBody] ScoreSubmissionRequest submission)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();

        var player = await signInManager.UserManager.GetUserAsync(HttpContext.User);

        _gameDatabase.Scores.Add(new Score
        {
            Id = Convert.ToUInt64(DateTime.UtcNow.Second),
            SubmissionDate = DateTime.UtcNow,
            Player = player!,
            TrackId = songId,
            TotalPoints = submission.Statistics.Score,
            Accuracy = submission.Statistics.Accuracy,
            Critical = submission.Statistics.Critical,
            Perfect = submission.Statistics.Perfect,
            Good = submission.Statistics.Good,
            Bad = submission.Statistics.Bad,
            Miss = submission.Statistics.Miss,
            RawJson = JsonConvert.SerializeObject(submission)
        });
        
        await _gameDatabase.SaveChangesAsync();

        return Ok();
    }
    
    /// <summary>
    ///     Get the best score belong to that song ID.
    /// </summary>
    /// <param name="songId">Song ID to retrieve.</param>
    [HttpGet("{songId:long}/best")]
    [Authorize]
    public async Task<ActionResult<Score>> GetSpecificBestScore(ulong songId)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();

        var player = await signInManager.UserManager.GetUserAsync(HttpContext.User);

        var bestScore =  _gameDatabase.Scores
            .Include(s => s.Player)
            .Where(score => score.Player.SequenceNumber == player!.SequenceNumber)
            .Where(score => score.TrackId == songId)
            .AsNoTracking()
            .OrderByDescending(score => score.TotalPoints);
        
        if (!bestScore.Any()) return NoContent();
        
        return Ok(await bestScore.FirstAsync());
    }
    
    /// <summary>
    ///     Get the recent score belong to that song ID.
    /// </summary>
    /// <param name="songId">Song ID to retrieve.</param>
    [HttpGet("{songId:long}/recent")]
    [Authorize]
    public async Task<ActionResult<Score>> GetSpecificRecentScore(ulong songId)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();

        var player = await signInManager.UserManager.GetUserAsync(HttpContext.User);

        var mostRecentScore = _gameDatabase.Scores
            .Include(s => s.Player)
            .Where(score => score.Player.SequenceNumber == player!.SequenceNumber)
            .Where(score => score.TrackId == songId)
            .AsNoTracking()
            .OrderByDescending(score => score.SubmissionDate);

        if (!mostRecentScore.Any()) return NoContent();
        
        return Ok(await mostRecentScore.FirstAsync());
    }
}