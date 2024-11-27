namespace Starlight.Backend.Controller.Request;

/// <summary>
///     Represent a forgot password request.
/// </summary>
public class PasswordForgotRequest
{
    /// <summary>
    ///     Email address to perform recovery.
    /// </summary>
    public required string Email { get; set; }
}