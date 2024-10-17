namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent a score of an user.
/// </summary>
public class Score
{
    /// <summary>
    ///     Score unique ID number.
    /// </summary>
    public ulong Id { get; set; }

    /// <summary>
    ///     Track associated with this score.
    /// </summary>
    public ulong TrackId { get; set; }

    /// <summary>
    ///     Total points of this score.
    /// </summary>
    public ulong TotalPoints { get; set; }
    
    /// <summary>
    ///     Accuracy of this score.
    /// </summary>
    public double Accuracy { get; set; }
    
    /// <summary>
    ///     Submission time of this score.
    /// </summary>
    public DateTime SubmissionDate { get; set; }

    /// <summary>
    ///     Associated user with this score.
    /// </summary>
    public Player Player { get; set; } = null!;
}