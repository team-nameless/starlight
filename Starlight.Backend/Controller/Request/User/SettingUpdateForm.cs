using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Controller.Request.User;

public class SettingUpdateForm
{
    /// <summary>
    ///     KeyCode, an array of 4 values of keycode, from left to right.
    /// </summary>
    public int[]? KeyCode { get; set; }

    /// <summary>
    ///     Frame rate setting.
    /// </summary>
    [Range(0, 999)]
    public int? FrameRate { get; set; }

    /// <summary>
    ///     Offset.
    /// </summary>
    [Range(-500, 500)]
    public int? Latency { get; set; }

    /// <summary>
    ///     Sound setting. An array of 4 values, in order of: Master, Audio, SFX.
    /// </summary>
    public int[]? SoundSetting { get; set; }
}