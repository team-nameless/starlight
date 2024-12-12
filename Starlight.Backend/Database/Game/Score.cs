using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent a score of a user.
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
    ///     Track name, to prevent from N+1 queries problem.
    /// </summary>
    [MaxLength(16384)]
    public required string TrackName { get; set; }

    /// <summary>
    ///     Total points of this score.
    /// </summary>
    public ulong TotalPoints { get; set; }
    
    /// <summary>
    ///     Accuracy of this score.
    /// </summary>
    public double Accuracy { get; set; }
    
    /// <summary>
    ///     Crit. Perfect count.
    /// </summary>
    public ulong Critical { get; set; }
    
    /// <summary>
    ///     Maximum achieved combo of this score.
    /// </summary>
    public ulong MaxCombo { get; set; }
    
    /// <summary>
    ///     Letter grade of this score.
    /// </summary>
    [MaxLength(10)]
    public required string Grade { get; set; }
    
    /// <summary>
    ///     Perfect count.
    /// </summary>
    public ulong Perfect { get; set; }
    
    /// <summary>
    ///     Good count.
    /// </summary>
    public ulong Good { get; set; }
    
    /// <summary>
    ///     Bad count.
    /// </summary>
    public ulong Bad { get; set; }
    
    /// <summary>
    ///     Miss count.
    /// </summary>
    public ulong Miss { get; set; }
    
    /// <summary>
    ///     Raw JSON data, for heatmap use.
    /// </summary>
    [MaxLength(int.MaxValue)]
    public required string RawJson { get; set; }
    
    /// <summary>
    ///     Submission time of this score.
    /// </summary>
    public DateTime SubmissionDate { get; set; }

    /// <summary>
    ///     Associated user with this score.
    /// </summary>
    [JsonIgnore]
    public Player Player { get; set; } = null!;
}