using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent an achievement.
/// </summary>
public class Achievement
{
    /// <summary>
    ///     Achievement ID
    /// </summary>
    public ulong Id { get; set; }
    
    /// <summary>
    ///     Achievement name.
    ///
    ///     Example: "First Step."
    /// </summary>
    [MaxLength(255)]
    public string Name { get; set; }
    
    /// <summary>
    ///     Achievement detail.
    ///
    ///     Example: "Play your first game."
    /// </summary>
    [MaxLength(512)]
    public string Detail { get; set; }
    
    /// <summary>
    ///     Achievement favor text.
    ///
    ///     Example: "A journey awaits."
    /// </summary>
    [MaxLength(512)]
    public string FavorText { get; set; }
    
    /// <summary>
    ///     Owners of this achievement.
    /// </summary>
    public List<User> Owners { get; set; } = [];
}