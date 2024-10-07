namespace Starlight.Backend.Controller.Request;

public class PasswordUpdateForm
{
    /// <summary>
    ///     Password for validation.
    /// </summary>
    public string Password { get; set; }

    /// <summary>
    ///     New password.
    /// </summary>
    public string NewPassword { get; set; }
}