using Microsoft.AspNetCore.Identity;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent a player of the game.
/// </summary>
public class Player : IdentityUser
{
    /// <summary>
    ///     This is what Genshin Impact calls "User ID"
    /// </summary>
    public long SequenceNumber { get; set; }
    
    /// <summary>
    ///     Time this user last seen on the game session.
    /// </summary>
    public DateTime LastSeenTime { get; set; }
    
    /// <summary>
    ///     Total user playtime, IN SECONDS.
    /// </summary>
    public ulong TotalPlayTime { get; set; }
    
    /// <summary>
    ///     Player exp.
    /// </summary>
    public ulong TotalExp { get; set; }

    /// <summary>
    ///     Player current level.
    ///     Could have used prefix-sum, but let's *not* talk about it.
    /// </summary>
    public ulong CurrentLevel { get; set; }
    
    /// <summary>
    ///     Achievements of this user.
    /// </summary>
    [PersonalData]
    public ICollection<Achievement> Achievements { get; } = new List<Achievement>();
    
    /// <summary>
    ///     BEST score of this user.
    /// </summary>
    [PersonalData]
    public ICollection<Score> BestScores { get; } = new List<Score>();
    
    /// <summary>
    ///     Friends of this user.
    /// 
    ///     If you don't have any friends, consider rolling
    ///     for [Socialize] banner, it only costs 1 primogem per pull. 
    /// </summary>
    [PersonalData]
    public ICollection<Player> Friends { get; } = new List<Player>();

    /// <summary>
    ///     Player preferential setting.
    /// </summary>
    [PersonalData]
    public UserSetting Setting { get; set; }
}