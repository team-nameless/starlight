namespace Starlight.Backend.Controller.Request.Session;

public class LoginForm
{
    /// <summary>
    ///     Initial email.
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    ///     Initial *hashed* password.
    /// </summary>
    public required string Password { get; set; }
}