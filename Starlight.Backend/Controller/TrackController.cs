using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Database.Track;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api/track")]
[ApiController]
public class TrackController : ControllerBase
{
    private TrackDatabaseService _trackDatabase;

    public TrackController(TrackDatabaseService trackDatabase)
    {
        _trackDatabase = trackDatabase;
    }

    /// <summary>
    ///     Get all available tracks.
    /// </summary>
    /// <returns></returns>
    [HttpGet("all")]
    [Produces("application/json")]
    public ActionResult<IEnumerable<Track>> GetAllTracks()
    {
        return Ok(_trackDatabase.Tracks.AsNoTracking());
    }

    /// <summary>
    ///     Look up on a particular level.
    /// </summary>
    /// <param name="trackId">Level ID.</param>
    [HttpGet("{trackId:int}")]
    [Produces("application/json")]
    public ActionResult<Track> GetTrack(ulong trackId)
    {
        var track = _trackDatabase.Tracks
            .AsNoTracking()
            .FirstOrDefault(t => t.Id == trackId);

        if (track == null) return NotFound("Track not found");

        return Ok(JsonSerializer.Serialize(new
        {
            TrackId = track.Id,
            TrackTitle = track.Title,
            TrackArtist = track.Artist,
            TrackSource = track.Source,
            TrackDifficulty = track.Difficulty,
        }));
    }
}