namespace Starlight.Backend.Database.Track;

/// <summary>
///     Represent a track set (a set of difficulties of a single track).
/// </summary>
public class TrackSet
{
    /// <summary>
    ///     Set ID.
    /// </summary>
    public ulong Id { get; set; }

    /// <summary>
    ///     Associated difficulties.
    /// </summary>
    public ICollection<Track> Tracks { get; } = new List<Track>();
}