namespace Starlight.Backend.Controller.Request.Identity;

public class PasswordResetForm
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