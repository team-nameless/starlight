using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent user setting.
/// </summary>
public class UserSetting
{
    /// <summary>
    ///     Why?
    /// </summary>
    public ulong Id { get; set; }

    /// <summary>
    ///     Key code number one - left most.
    ///     Defaults to A.
    /// </summary>
    public int KeyCode1 { get; set; } = 65;

    /// <summary>
    ///     Key code number two - left middle.
    ///     Defaults to S.
    /// </summary>
    public int KeyCode2 { get; set; } = 83;

    /// <summary>
    ///     Key code number three - right middle.
    ///     Defaults to ; (semicolon).
    /// </summary>
    public int KeyCode3 { get; set; } = 59;

    /// <summary>
    ///     Key code number four - right most.
    ///     Defaults to ' (single quote).
    /// </summary>
    public int KeyCode4 { get; set; } = 222;

    /// <summary>
    ///     Master volume.
    /// </summary>
    [Range(0, 100)]
    public int MasterVolume { get; set; } = 80;

    /// <summary>
    ///     Music volume.
    /// </summary>
    [Range(0, 100)]
    public int MusicVolume { get; set; } = 100;

    /// <summary>
    ///     SFX volume.
    /// </summary>
    [Range(0, 100)]
    public int SoundEffectVolume { get; set; } = 100;

    /// <summary>
    ///     Offset.
    /// </summary>
    [Range(-500, 500)]
    public int Offset { get; set; } = 0;
    
    /// <summary>
    ///     Frame rate, in terms of "Frames per second"
    /// </summary>
    [Range(0, 999)]
    public int FrameRate { get; set; } = 60;

    /// <summary>
    ///     Player associated with this setting.
    /// </summary>
    public Player Player { get; set; } = null!;
}