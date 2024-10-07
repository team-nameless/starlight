using Microsoft.AspNetCore.Mvc;
using Starlight.Backend.Attributes;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Enum;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api/user")]
[RequireRole(UserRole.Regular)]
[ApiController]
public class UserController : ControllerBase
{
    private GameDatabaseService _gameDatabase;

    public UserController(GameDatabaseService gameDatabase)
    {
        _gameDatabase = gameDatabase;
    }

    [HttpGet("/{userId:int}")]
    public IActionResult GetUser(ulong userId)
    {
        var user = _gameDatabase.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        // TODO: Format return result.
        return Ok();
    }

    [HttpPatch("/{userId:int}/profile/handle")]
    public IActionResult UpdateUserEmail(ulong userId, [FromBody] HandleUpdateForm settings)
    {
        // TODO: Prevent hijacking.

        var user = _gameDatabase.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        user.Handle = settings.Handle;

        _gameDatabase.SaveChanges();

        return Ok();
    }

    [HttpPatch("/{userId:int}/profile/email")]
    public IActionResult UpdateUserEmail(ulong userId, [FromBody] EmailUpdateForm settings)
    {
        // TODO: Prevent hijacking.

        var user = _gameDatabase.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        if (user.HashedPassword != settings.Password)
        {
            return BadRequest("Passwords do not match");
        }

        user.Email = settings.Email;

        _gameDatabase.SaveChanges();

        return Redirect("/api/logout");
    }

    [HttpPatch("/{userId:int}/profile/password")]
    public IActionResult UpdateUserProfile(ulong userId, [FromBody] PasswordUpdateForm settings)
    {
        // TODO: Prevent hijacking.

        var user = _gameDatabase.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        if (user.HashedPassword != settings.Password)
        {
            return BadRequest("Passwords do not match");
        }

        user.HashedPassword = settings.NewPassword;

        _gameDatabase.SaveChanges();

        return Ok();
    }

    [HttpPatch("/{userId:int}/settings")]
    public IActionResult UpdateUserSettings(ulong userId, [FromBody] SettingUpdateForm settings)
    {
        // TODO: Prevent hijacking.

        var user = _gameDatabase.Users.FirstOrDefault(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        user.Setting.KeyCode1 = settings.KeyCode[0];
        user.Setting.KeyCode2 = settings.KeyCode[1];
        user.Setting.KeyCode3 = settings.KeyCode[2];
        user.Setting.KeyCode4 = settings.KeyCode[3];

        user.Setting.Offset = settings.Latency;

        user.Setting.MasterVolume = settings.SoundSetting[0];
        user.Setting.MusicVolume = settings.SoundSetting[1];
        user.Setting.SoundEffectVolume = settings.SoundSetting[2];

        _gameDatabase.SaveChanges();

        return Ok();
    }
}