using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Starlight.Backend.Database.Game;

/// <summary>
///     Represent player setting.
/// </summary>
public class Setting
{
    /// <summary>
    ///     Why?
    /// </summary>
    public ulong Id { get; set; }

    /// <summary>
    ///     Key code number one - left most.
    ///     Defaults to A.
    /// </summary>
    public int KeyCode1 { get; set; }

    /// <summary>
    ///     Key code number two - left middle.
    ///     Defaults to S.
    /// </summary>
    public int KeyCode2 { get; set; }

    /// <summary>
    ///     Key code number three - right middle.
    ///     Defaults to ; (semicolon).
    /// </summary>
    public int KeyCode3 { get; set; }

    /// <summary>
    ///     Key code number four - right most.
    ///     Defaults to ' (single quote).
    /// </summary>
    public int KeyCode4 { get; set; }

    /// <summary>
    ///     Master volume.
    /// </summary>
    [Range(0, 100)]
    public int MasterVolume { get; set; }

    /// <summary>
    ///     Music volume.
    /// </summary>
    [Range(0, 100)]
    public int MusicVolume { get; set; }

    /// <summary>
    ///     SFX volume.
    /// </summary>
    [Range(0, 100)]
    public int SoundEffectVolume { get; set; }

    /// <summary>
    ///     Offset.
    /// </summary>
    [Range(-500, 500)]
    public int Offset { get; set; }
    
    /// <summary>
    ///     Frame rate, in terms of "Frames per second"
    /// </summary>
    [Range(0, 999)]
    public int FrameRate { get; set; }

    /// <summary>
    ///     Player associated with this setting.
    /// </summary>
    [JsonIgnore]
    public Player Player { get; set; } = null!;
}