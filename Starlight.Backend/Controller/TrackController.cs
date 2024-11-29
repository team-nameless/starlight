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
    [HttpGet("all")]
    [Produces("application/json")]
    public ActionResult<IEnumerable<Track>> GetAllTracks()
    {
        var tracks = _trackDatabase.Tracks.AsNoTracking();
        var responseList = new List<object>();
        
        var scheme = HttpContext.Request.Scheme;
        var authorityUrl = HttpContext.Request.Host.Value;

        foreach (var track in tracks)
        {
            responseList.Add(new
            {
                Id = track.Id,
                Title = track.Title,
                Artist = track.Artist,
                Source = track.Source,
                NoteDesigner = track.NoteDesigner,
                Duration = track.Duration,
                Difficulty = track.Difficulty,
                DifficultyFavorText = track.DifficultyFavorText,
                BackgroundUrl = $"{scheme}://{authorityUrl}/{track.BackgroundFileLocation}",
                AudioUrl = $"{scheme}://{authorityUrl}/{track.AudioFileLocation}",
                DataUrl = $"{scheme}://{authorityUrl}/{track.DataFileLocation}",
            });
        }
        
        return Ok(responseList);
    }

    /// <summary>
    ///     Get a particular track.
    /// </summary>
    /// <param name="trackId">Track ID.</param>
    [HttpGet("{trackId:int}")]
    [Produces("application/json")]
    public ActionResult<Track> GetTrack(ulong trackId)
    {
        var track = _trackDatabase.Tracks
            .AsNoTracking()
            .FirstOrDefault(t => t.Id == trackId);

        if (track == null) return NotFound("Track not found");
        
        var scheme = HttpContext.Request.Scheme;
        var authorityUrl = HttpContext.Request.Host.Value;

        return Ok(new
        {
            Id = track.Id,
            Title = track.Title,
            Artist = track.Artist,
            Source = track.Source,
            NoteDesigner = track.NoteDesigner,
            Duration = track.Duration,
            Difficulty = track.Difficulty,
            DifficultyFavorText = track.DifficultyFavorText,
            BackgroundUrl = $"{scheme}://{authorityUrl}{track.BackgroundFileLocation}",
            AudioUrl = $"{scheme}://{authorityUrl}{track.AudioFileLocation}",
            DataUrl = $"{scheme}://{authorityUrl}{track.DataFileLocation}",
        });
    }
}