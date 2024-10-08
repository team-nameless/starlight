using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent a user of the game.
/// </summary>
public class User
{
    /// <summary>
    ///     User unique ID number.
    /// </summary>
    public ulong Id { get; set; }
    
    /// <summary>
    ///     User identifier string.
    /// </summary>
    [MaxLength(255)]
    public required string Handle { get; set; }

    /// <summary>
    ///     User unique email.
    /// </summary>
    [MaxLength(255)]
    public required string Email { get; set; }
    
    /// <summary>
    ///     User hashed password.
    /// </summary>
    [MaxLength(16384)]
    public required string HashedPassword { get; set; }
    
    /// <summary>
    ///     Time this user last seen on the game session.
    /// </summary>
    public DateTime LastSeenTime { get; set; }
    
    /// <summary>
    ///     Total user playtime, IN SECONDS.
    /// </summary>
    public ulong TotalPlayTime { get; set; }
    
    /// <summary>
    ///     User exp.
    /// </summary>
    public ulong TotalExp { get; set; }

    /// <summary>
    ///     User current level.
    ///     Could have used prefix-sum, but let's *not* talk about it.
    /// </summary>
    public ulong CurrentLevel { get; set; }
    
    /// <summary>
    ///     Achievements of this user.
    /// </summary>
    public ICollection<Achievement> Achievements { get; } = new List<Achievement>();
    
    /// <summary>
    ///     BEST score of this user.
    /// </summary>
    public ICollection<Score> BestScores { get; } = new List<Score>();
    
    /// <summary>
    ///     Friends of this user.
    /// 
    ///     If you don't have any friends, consider rolling
    ///     for [Socialize] banner, it only costs 1 primogem per pull. 
    /// </summary>
    public ICollection<User> Friends { get; } = new List<User>();

    /// <summary>
    ///     User preferential setting.
    /// </summary>
    public UserSetting Setting { get; set; }
}