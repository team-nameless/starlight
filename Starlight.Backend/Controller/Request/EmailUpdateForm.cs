namespace Starlight.Backend.Controller.Request;

public class EmailUpdateForm
{
    /// <summary>
    ///     New email address.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    ///     Password for validation.
    /// </summary>
    public string Password { get; set; }
}