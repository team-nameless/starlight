namespace Starlight.Backend.Controller.Request;

/// <summary>
///     Represent a login request.
/// </summary>
public class LoginRequest
{
    /// <summary>
    ///     Login email.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    ///     Login password.
    /// </summary>
    public required string Password { get; set; }
}