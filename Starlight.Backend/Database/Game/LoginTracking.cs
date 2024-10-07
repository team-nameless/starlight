using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Tracking database for logged-in sessions.
/// </summary>
public class LoginTracking
{
    /// <summary>
    ///     Email address.
    /// </summary>
    [Key]
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    ///     The bearer token associated.
    /// </summary>
    [MaxLength(16384)]
    public string Token { get; set; } = string.Empty;
}