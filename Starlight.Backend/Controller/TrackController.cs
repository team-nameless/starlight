using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    ///     Look up on a particular level set.
    /// </summary>
    /// <param name="setId">Set ID.</param>
    [HttpGet("set/{setId:int}")]
    public ActionResult GetTrackSet(ulong setId)
    {
        var trackSet = _trackDatabase.TrackSets
            .Include(set => set.Tracks)
            .AsNoTracking()
            .FirstOrDefault(set => set.Id == setId);

        if (trackSet == null) return NotFound("Track set not found");
        
        return Ok(JsonSerializer.Serialize(new
        {
            SetId = trackSet.Id,
            Tracks = JsonSerializer.Serialize(trackSet.Tracks)
        }));
    }

    /// <summary>
    ///     Look up on a particular level.
    /// </summary>
    /// <param name="trackId">Level ID.</param>
    [HttpGet("{trackId:int}")]
    public ActionResult GetTrack(ulong trackId)
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