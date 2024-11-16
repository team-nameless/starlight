namespace Starlight.Backend.Controller.Request.Identity;

/// <summary>
///     Represent a login request.
/// </summary>
public class LoginForm
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