namespace Starlight.Backend.Controller.Request;

/// <summary>
///     Represents a reset password request.
/// </summary>
public class PasswordResetRequest
{
    /// <summary>
    ///     Email address to perform reset.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    ///     Reset code.
    /// </summary>
    public required string Code { get; set; }

    /// <summary>
    ///     New password.
    /// </summary>
    public required string NewPassword { get; set; }
}