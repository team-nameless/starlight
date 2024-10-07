using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Attributes;
using Starlight.Backend.Enum;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api/track")]
[RequireRole(UserRole.Regular)]
[ApiController]
public class TrackController : ControllerBase
{
    private TrackDatabaseService _trackDatabase;

    public TrackController(TrackDatabaseService trackDatabase)
    {
        _trackDatabase = trackDatabase;
    }

    [HttpGet("/set/{setId:int}")]
    public IActionResult GetTrackSet(ulong setId)
    {
        var trackSet = _trackDatabase.TrackSets
            .AsNoTracking()
            .Include(set => set.Tracks)
            .FirstOrDefault(set => set.Id == setId);

        if (trackSet == null) return NotFound("Track set not found");

        // TODO: Format return result.
        return Ok();
    }

    [HttpGet("/single/{trackId:int}")]
    public IActionResult GetTrack(ulong trackId)
    {
        var track = _trackDatabase.Tracks
            .AsNoTracking()
            .FirstOrDefault(t => t.Id == trackId);

        if (track == null) return NotFound("Track not found");

        // TODO: Format return result.
        return Ok();
    }
}