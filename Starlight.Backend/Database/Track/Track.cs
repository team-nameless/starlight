using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Track;

/// <summary>
///     Represent a single track.
/// </summary>
public class Track
{
    /// <summary>
    ///     Track ID.
    /// </summary>
    public ulong Id { get; set; }

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
    ///     Note designer name.
    /// </summary>
    [MaxLength(128)]
    public required string NoteDesigner { get; set; }
    
    /// <summary>
    ///     Difficulty constant of this track.
    /// </summary>
    [Range(1, 10)]
    public double Difficulty { get; set; }
    
    /// <summary>
    ///     Difficulty favor text. Use if anyone wants.
    /// </summary>
    [MaxLength(255)]
    public required string DifficultyFavorText { get; set; }
    
    /// <summary>
    ///     Duration, in milisecond.
    /// </summary>
    public ulong Duration { get; set; }
    
    /// <summary>
    ///     Data file location.
    /// </summary>
    [MaxLength(255)]
    public required string DataFileLocation { get; set; }
    
    /// <summary>
    ///     Background file location.
    /// </summary>
    [MaxLength(255)]
    public required string BackgroundFileLocation { get; set; }
    
    /// <summary>
    ///     Audio file location.
    /// </summary>
    [MaxLength(255)]
    public required string AudioFileLocation { get; set; }
}