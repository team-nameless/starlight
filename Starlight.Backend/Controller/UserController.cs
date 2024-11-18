using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    /// <param name="userId">Account ID, default to self if provided nothing.</param>
    [HttpGet]
    [Authorize]
    [Produces("application/json")]
    public async Task<ActionResult> GetUser(long? userId = null)
    {
        // default to self.
        userId ??= 0;
        
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

        var scheme = HttpContext.Request.Scheme;
        var authorityUrl = HttpContext.Request.Host.Value;

        return Ok(new
        {
            Id = user.SequenceNumber,
            Name = user.DisplayName,
            Avatar = $"{scheme}://{authorityUrl}/avatars/{user.SequenceNumber}.jpeg",
            Level = user.CurrentLevel,
            Exp = user.TotalExp,
            PlayTime = user.TotalPlayTime,
            LastSeen = user.LastSeenTime,
            TopScores = user.BestScores,
            FriendList = user.Friends,
            AchievementList = user.Achievements,
        });
    }
    
    /// <summary>
    ///     Modify profile of current player.
    /// </summary>
    [HttpPatch("profile")]
    [Authorize]
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
    ///     Set profile image of current player.
    /// </summary>
    /// <param name="file">File object.</param>
    [HttpPut("profile/image")]
    [Authorize]
    public async Task<ActionResult> UpdateProfileImage(
        [Required] IFormFile file
    )
    {
        // 10 MB
        const int maxImageSize = 10 * 1024 * 1024;
        string[] allowedExtensions = [".png", ".jpg", "jpeg "];
        
        if (string.IsNullOrEmpty(file.FileName)) return BadRequest("How did we get here?");
        if (file.Length == 0) return BadRequest("File is empty");
        if (file.Length > maxImageSize) return BadRequest("File is too big");

        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        
        if (string.IsNullOrEmpty(fileExtension)) return BadRequest("File has no valid extension");
        if (!allowedExtensions.Contains(fileExtension)) return BadRequest("Invalid file extension");
        
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;

        var user = await userManager.GetUserAsync(User);
        var savePath = Path.Combine(Directory.GetCurrentDirectory(), "avatars", $"{user!.SequenceNumber}.jpeg");

        await using (var stream = new FileStream(savePath, FileMode.OpenOrCreate, FileAccess.Write))
        {
            await file.CopyToAsync(stream);    
        }
        
        return Ok();
    }

    /// <summary>
    ///     Modify settings of current player.
    /// </summary>
    [HttpPatch("settings")]
    [Authorize]
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

    /// <summary>
    ///     Delete current logged-in player. Use with EXTREME CAUTION. You have been warned.
    /// </summary>
    [HttpDelete("delete")]
    [Authorize]
    public async Task<ActionResult> DeleteUser()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var player = await userManager.GetUserAsync(User);

        if (player == null) return BadRequest("Player not found");

        await userManager.DeleteAsync(player);

        return Ok();
    }
}