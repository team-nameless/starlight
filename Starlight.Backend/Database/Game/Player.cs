using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent a player of the game.
/// </summary>
public class Player : IdentityUser<Guid>
{
    /// <summary>
    ///     This is what Genshin Impact calls "User ID"
    /// </summary>
    public ulong SequenceNumber { get; set; }
    
    /// <summary>
    ///     Display name of the user.
    /// </summary>
    [MaxLength(255)]
    public required string DisplayName { get; set; }
    
    /// <summary>
    ///     Time this user last seen on the game session.
    /// </summary>
    public DateTime LastSeenTime { get; set; }
    
    /// <summary>
    ///     Total user playtime, IN SECONDS.
    /// </summary>
    public ulong TotalPlayTime { get; set; }
    
    /// <summary>
    ///     Player exp of the level.
    /// </summary>
    public ulong TotalExp { get; set; }

    /// <summary>
    ///     Player current level.
    ///     Could have used prefix-sum, but let's *not* talk about it.
    /// </summary>
    public ulong CurrentLevel { get; set; }

    /// <summary>
    ///     Max exp for designated level.
    /// </summary>
    public ulong MaxExpForLevel
    {
        get
        {
            const ulong c = 53;
            var z = (double) CurrentLevel;
            var t = Math.Max(0, (z + c - 92) * 0.02);

            return (ulong) ((t + 0.1) * Math.Pow(z + c, 2)) + 1;
        }
        set => _ = value;
    }
    
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
    public Setting? Setting { get; set; }
}