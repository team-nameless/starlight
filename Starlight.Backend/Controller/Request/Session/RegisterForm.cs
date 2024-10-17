namespace Starlight.Backend.Controller.Request.Session;

public class RegisterForm
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