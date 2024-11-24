namespace Starlight.Backend.Controller.Request;

/// <summary>
///     Represent a register request.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    ///     Initial handle.
    /// </summary>
    public required string Handle { get; set; }

    /// <summary>
    ///     Initial email.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    ///     Initial password.
    /// </summary>
    public required string Password { get; set; }
}