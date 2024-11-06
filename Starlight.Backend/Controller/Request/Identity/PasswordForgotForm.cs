namespace Starlight.Backend.Controller.Request.Session;

public class PasswordForgotForm
{
    /// <summary>
    ///     Email address to perform recovery.
    /// </summary>
    public required string Email { get; set; }
}