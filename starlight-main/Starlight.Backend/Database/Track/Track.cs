using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Track;

/// <summary>
///     Represent a *single* track difficulty.
/// </summary>
public class Track
{
    /// <summary>
    ///     Track ID.
    /// </summary>
    public ulong Id { get; set; }

    /// <summary>
    ///     Note designer name.
    /// </summary>
    [MaxLength(128)]
    public required string NoteDesigner { get; set; }

    /// <summary>
    ///     Track name.
    /// </summary>
    [MaxLength(255)]
    public required string Title { get; set; }

    /// <summary>
    ///     Track artist.
    /// </summary>
    [MaxLength(255)]
    public required string Artist { get; set; }

    /// <summary>
    ///     The source this music came from.
    /// </summary>
    [MaxLength(255)]
    public required string Source { get; set; }

    /// <summary>
    ///     Difficulty of this track.
    /// </summary>
    [Range(1, 16)]
    public double Difficulty { get; set; }

    /// <summary>
    ///     The parent set.
    /// </summary>
    public TrackSet TrackSet { get; set; } = null!;
}