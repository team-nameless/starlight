namespace Starlight.Backend.Enum;

/// <summary>
///     Think like HR department.
///     Implemented in privilege-based manner.
/// </summary>
public enum UserRole
{
    /// <summary>
    ///     Represents a NOT-signed-in user.
    /// </summary>
    Anonymous = 1 << 0,

    /// <summary>
    ///     Represents a signed-in user, with READ access to the data.
    /// </summary>
    Regular = 1 << 1,

    /// <summary>
    ///     Represents an editor, with WRITE access to the *minimal* set of data.
    /// </summary>
    Editor = Regular | 1 << 2,

    /// <summary>
    ///     Represents a developer, with WRITE access to the *wider* set than that of "Editor".
    /// </summary>
    Developer = Editor | 1 << 3,

    /// <summary>
    ///     Omnipotent.
    /// </summary>
    Admin = Developer | 1 << 4,
}