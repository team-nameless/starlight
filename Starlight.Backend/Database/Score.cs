namespace Starlight.Backend.Database;

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
    ///     Associated user with this score.
    /// </summary>
    public User User { get; set; } = null!;
    
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
}