namespace Starlight.Backend.Controller.Request.User;

public class ProfileUpdateForm
{
    /// <summary>
    ///     New handle.
    /// </summary>
    public string? Handle { get; set; } = null;
    
    /// <summary>
    ///     New email address.
    /// </summary>
    public string? Email { get; set; } = null;

    /// <summary>
    ///     Password for validation.
    /// </summary>
    public string? Password { get; set; } = null;
    
    /// <summary>
    ///     New password.
    /// </summary>
    public string? NewPassword { get; set; } = null;
}