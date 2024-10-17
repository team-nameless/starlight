using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Controller.Request.User;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api/user")]
[ApiController]
public class UserController : ControllerBase
{
    private GameDatabaseService _gameDatabase;

    public UserController(GameDatabaseService gameDatabase)
    {
        _gameDatabase = gameDatabase;
    }
    
    /// <summary>
    ///     Look up a particular player account.
    /// </summary>
    /// <param name="userId">Account ID, set 0 for self.</param>
    [HttpGet("{userId:long}")]
    public async Task<ActionResult> GetUser(long userId)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;

        var user = userId != 0
            ? _gameDatabase.Users
                .AsNoTracking()
                .Include(p => p.Achievements)
                .Include(p => p.Friends)
                .Include(p => p.BestScores)
                .FirstOrDefault(u => u.SequenceNumber == userId)
            : await userManager.GetUserAsync(User);

        if (user == null) return NotFound("Player not found");

        return Ok(JsonSerializer.Serialize(new
        {
            Id = user.SequenceNumber,
            Name = user.UserName,
            Level = user.CurrentLevel,
            Exp = user.TotalExp,
            PlayTime = user.TotalPlayTime,
            LastSeen = user.LastSeenTime,
            TopScores = user.BestScores,
            FriendList = user.Friends,
            AchievementList = user.Achievements,
        }));
    }
    
    /// <summary>
    ///     Modify profile of current user.
    /// </summary>
    [HttpPatch("profile")]
    public async Task<ActionResult> UpdateProfile([FromBody] ProfileUpdateForm profileUpdate)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var player = await userManager.GetUserAsync(User);

        if (player == null) return BadRequest("Player not found");
        
        IdentityResult? nameChangeResult = null;
        IdentityResult? emailChangeResult = null;
        IdentityResult? passwordChangeResult = null;

        if (!string.IsNullOrEmpty(profileUpdate.Handle))
        {
            nameChangeResult = await userManager.SetUserNameAsync(player, profileUpdate.Handle);
        }

        if (!string.IsNullOrEmpty(profileUpdate.Email))
        { 
            emailChangeResult = await userManager.SetEmailAsync(player, profileUpdate.Email);
        }

        if (!string.IsNullOrEmpty(profileUpdate.Password) && !string.IsNullOrEmpty(profileUpdate.NewPassword))
        {
            passwordChangeResult = await userManager.ChangePasswordAsync(
                player,
                profileUpdate.Password,
                profileUpdate.NewPassword
            );
        }

        if (nameChangeResult is { Succeeded: false }) return BadRequest(nameChangeResult.ToString());
        if (emailChangeResult is { Succeeded: false }) return BadRequest(emailChangeResult.ToString());
        if (passwordChangeResult is { Succeeded: false }) return BadRequest(passwordChangeResult.ToString());

        await userManager.UpdateAsync(player);
        await _gameDatabase.SaveChangesAsync();

        return Ok();
    }

    /// <summary>
    ///     Modify settings of current user.
    /// </summary>
    [HttpPatch("settings")]
    public async Task<ActionResult> UpdateSettings([FromBody] SettingUpdateForm settingsUpdate)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var player = await userManager.GetUserAsync(User);

        if (player == null) return BadRequest("Player not found");

        if (settingsUpdate.KeyCode != null)
        {
            player.Setting.KeyCode1 = settingsUpdate.KeyCode[0];
            player.Setting.KeyCode2 = settingsUpdate.KeyCode[1];
            player.Setting.KeyCode3 = settingsUpdate.KeyCode[2];
            player.Setting.KeyCode4 = settingsUpdate.KeyCode[3];
        }

        if (settingsUpdate.Latency.HasValue)
        {
            player.Setting.Offset = settingsUpdate.Latency.Value;
        }

        if (settingsUpdate.SoundSetting != null)
        {
            player.Setting.MasterVolume = settingsUpdate.SoundSetting[0];
            player.Setting.MusicVolume = settingsUpdate.SoundSetting[1];
            player.Setting.SoundEffectVolume = settingsUpdate.SoundSetting[2];
        }

        if (settingsUpdate.FrameRate.HasValue)
        {
            player.Setting.FrameRate = settingsUpdate.FrameRate.Value;
        }
        
        await _gameDatabase.SaveChangesAsync();

        return Ok();
    }
}