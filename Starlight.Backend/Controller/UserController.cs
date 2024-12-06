using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starlight.Backend.Controller.Request;
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
    [HttpGet]
    [Authorize]
    [Produces("application/json")]
    public async Task<ActionResult> GetUser()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;

        var loggedInPlayer = await userManager.GetUserAsync(User);
        var userId = loggedInPlayer!.SequenceNumber;

        var user = _gameDatabase.Users
            .AsNoTracking()
            .Include(p => p.Achievements)
            .Include(p => p.Friends)
            .Include(p => p.BestScores)
            .FirstOrDefault(u => u.SequenceNumber == userId);

        var scheme = HttpContext.Request.Scheme;
        var authorityUrl = HttpContext.Request.Host.Value;

        var avatarsPath = Path.Combine(Directory.GetCurrentDirectory(), "avatars", $"{user.SequenceNumber}.jpeg");
        var isAvatarAvailable = System.IO.File.Exists(avatarsPath);

        return Ok(new
        {
            Id = user.SequenceNumber,
            Name = user.DisplayName,
            Email = user.Email,
            Avatar = isAvatarAvailable ? $"{scheme}://{authorityUrl}/avatars/{user.SequenceNumber}.jpeg" : "",
            Level = user.CurrentLevel,
            Exp = user.TotalExp,
            ExpNeededForNextLevel = user.MaxExpForLevel,
            PlayTime = user.TotalPlayTime,
            LastSeen = user.LastSeenTime,
            TopScores = user.BestScores.OrderByDescending(s => s.TotalPoints),
            FriendList = user.Friends,
            AchievementList = user.Achievements
        });
    }
    
    /// <summary>
    ///     Modify profile of current player.
    /// </summary>
    [HttpPatch("profile")]
    [Authorize]
    public async Task<ActionResult> UpdateProfile([FromBody] ProfileUpdateRequest profileUpdate)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var player = await userManager.GetUserAsync(User);
        
        IdentityResult? nameChangeResult = null;
        IdentityResult? emailChangeResult = null;
        IdentityResult? passwordChangeResult = null;

        if (!string.IsNullOrEmpty(profileUpdate.Handle))
        {
            var desiredUser = await _gameDatabase.Users.FirstAsync(x => x.SequenceNumber == player!.SequenceNumber);
            desiredUser.DisplayName = profileUpdate.Handle;
        }

        if (!string.IsNullOrEmpty(profileUpdate.Email) && !string.IsNullOrEmpty(profileUpdate.Password))
        {
            var validateResult = await userManager.CheckPasswordAsync(player!, profileUpdate.Password);

            if (validateResult)
            {
                // blame Microsoft as usual
                nameChangeResult = await userManager.SetUserNameAsync(player!, profileUpdate.Email);
                emailChangeResult = await userManager.SetEmailAsync(player!, profileUpdate.Email);
            }
            else
            {
                return BadRequest("You messed up something.");
            }
        }

        if (!string.IsNullOrEmpty(profileUpdate.Password) && !string.IsNullOrEmpty(profileUpdate.NewPassword))
        {
            passwordChangeResult = await userManager.ChangePasswordAsync(
                player!,
                profileUpdate.Password,
                profileUpdate.NewPassword
            );
        }

        if (nameChangeResult is { Succeeded: false }) return BadRequest(nameChangeResult.ToString());
        if (emailChangeResult is { Succeeded: false }) return BadRequest(emailChangeResult.ToString());
        if (passwordChangeResult is { Succeeded: false }) return BadRequest(passwordChangeResult.ToString());

        await userManager.UpdateAsync(player!);
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
        string[] allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
        
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
    ///     Reset profile image. Discord has it, why can't I?
    /// </summary>
    /// <returns></returns>
    [HttpDelete("profile/image")]
    [Authorize]
    public async Task<ActionResult> ResetProfileImage()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var user = await userManager.GetUserAsync(User);
        
        var avatarsPath = Path.Combine(Directory.GetCurrentDirectory(), "avatars", $"{user!.SequenceNumber}.jpeg");

        if (!System.IO.File.Exists(avatarsPath)) return NoContent();
        
        System.IO.File.Delete(avatarsPath);
        return Ok();
    }

    /// <summary>
    ///     Get settings of current player.
    /// </summary>
    /// <returns></returns>
    [HttpGet("settings")]
    [Authorize]
    public async Task<ActionResult> GetSettings()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        var player = await userManager.GetUserAsync(User);

        var setting = _gameDatabase.Settings
            .AsNoTracking()
            .First(setting => setting.Player.Id == player!.Id);

        return Ok(setting);
    }
    
    /// <summary>
    ///     Modify settings of current player.
    /// </summary>
    [HttpPatch("settings")]
    [Authorize]
    public async Task<ActionResult> UpdateSettings([FromBody] SettingUpdateRequest settingsUpdate)
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        var userManager = signInManager.UserManager;
        
        var player = await userManager.GetUserAsync(User);
        
        var user = _gameDatabase.Users
            .Include(u => u.Setting)
            .First(u => u.Id == player!.Id);
        
        if (settingsUpdate.KeyCode != null)
        {
            user.Setting!.KeyCode1 = settingsUpdate.KeyCode[0];
            user.Setting!.KeyCode2 = settingsUpdate.KeyCode[1];
            user.Setting!.KeyCode3 = settingsUpdate.KeyCode[2];
            user.Setting!.KeyCode4 = settingsUpdate.KeyCode[3];
        }

        if (settingsUpdate.Latency.HasValue)
        {
            user.Setting!.Offset = settingsUpdate.Latency.Value;
        }

        if (settingsUpdate.SoundSetting != null)
        {
            user.Setting!.MasterVolume = settingsUpdate.SoundSetting[0];
            user.Setting!.MusicVolume = settingsUpdate.SoundSetting[1];
            user.Setting!.SoundEffectVolume = settingsUpdate.SoundSetting[2];
        }

        if (settingsUpdate.FrameRate.HasValue)
        {
            user.Setting!.FrameRate = settingsUpdate.FrameRate.Value;
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

        await signInManager.SignOutAsync();
        await userManager.DeleteAsync(player!);

        return Ok("LoggedOutAndDeleted");
    }
}