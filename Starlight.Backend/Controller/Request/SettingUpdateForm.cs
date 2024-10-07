using System.ComponentModel.DataAnnotations;

namespace Starlight.Backend.Controller.Request;

public class SettingUpdateForm
{
    /// <summary>
    ///     KeyCode, an array of 4 values of keycode, from left to right.
    /// </summary>
    public required int[] KeyCode { get; set; }

    /// <summary>
    ///     Frame rate setting.
    /// </summary>
    [Range(0, 999)]
    public int FrameRate { get; set; }

    /// <summary>
    ///     Offset.
    /// </summary>
    [Range(-500, 500)]
    public int Latency { get; set; }

    /// <summary>
    ///     Sound setting. In order of: Master, Audio, SFX.
    /// </summary>
    public required int[] SoundSetting { get; set; }
}