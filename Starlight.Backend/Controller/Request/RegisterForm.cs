namespace Starlight.Backend.Controller.Request;

public class RegisterForm
{
    /// <summary>
    ///     Initial handle.
    /// </summary>
    public string Handle { get; set; }

    /// <summary>
    ///     Initial email.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    ///     Initial *hashed* password.
    /// </summary>
    public string Password { get; set; }
}