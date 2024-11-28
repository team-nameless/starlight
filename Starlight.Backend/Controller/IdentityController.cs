using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Enum;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api")]
[ApiController]
public class IdentityController : ControllerBase
{
    private GameDatabaseService _gameDatabase;
    private IdentityEmailService _emailService;

    public IdentityController(GameDatabaseService gameDatabase, IdentityEmailService emailService)
    {
        _gameDatabase = gameDatabase;
        _emailService = emailService;
    }
    
    /// <summary>
    ///     Perform an account registration.
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult> Register(
        [FromBody] RegisterRequest registration
    )
    {
        var services = HttpContext.RequestServices;
        
        var userManager = services.GetRequiredService<UserManager<Player>>();
        var emailAddressValidator = new EmailAddressAttribute();
        var userStore = services.GetRequiredService<IUserStore<Player>>();
        var emailStore = (IUserEmailStore<Player>)userStore;
        
        var email = registration.Email;
        
        if (string.IsNullOrEmpty(email) || !emailAddressValidator.IsValid(email))
        {
            return BadRequest("Email validation failed.");
        }

        var user = new Player
        {
            DisplayName = registration.Handle,
            CurrentLevel = 1,
            TotalExp = 0,
            SequenceNumber = (ulong) DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            Setting = new Setting
            {
                Offset = 0,
                FrameRate = 120,
                KeyCode1 = (int) KeyCode.KeyA,
                KeyCode2 = (int) KeyCode.KeyS,
                KeyCode3 = (int) KeyCode.KeySemicolon,
                KeyCode4 = (int) KeyCode.KeyQuote,
                MasterVolume = 80,
                MusicVolume = 100,
                SoundEffectVolume = 100
            }
        };
        
        // why Microsoft have to set the UserName TO. BE. FUCKING. UNIQUE????
        await userStore.SetUserNameAsync(user, email, CancellationToken.None);
        await emailStore.SetEmailAsync(user, email, CancellationToken.None);
        
        var result = await userManager.CreateAsync(user, registration.Password);
        
        if (!result.Succeeded)
        {
            return BadRequest(result.ToString());
        }
        
        return Ok();
    }

    /// <summary>
    ///     Perform an account login.
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult> Login(
        [FromBody] LoginRequest login
    )
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        
        var attemptedUser = _gameDatabase.Users.FirstOrDefault(x => x.Email == login.Email);

        if (attemptedUser == null)
        {
            return Unauthorized("User not found.");
        }
        
        signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;
        var result = await signInManager.PasswordSignInAsync(
            attemptedUser,
            login.Password,
            isPersistent: true,
            lockoutOnFailure: false
        );

        if (!result.Succeeded)
        {
            return Unauthorized(result.ToString());
        }

        await signInManager.UserManager.AddClaimAsync(attemptedUser, new Claim("Status", "LoggedIn"));
        return Ok();
    }

    /// <summary>
    ///     Perform an account logout.
    /// </summary>
    [HttpGet("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        
        await signInManager.SignOutAsync();
        
        return Redirect("/");
    }

    /// <summary>
    ///     Perform a password reset flow.
    /// </summary>
    /// <param name="passwordForgot">Request body.</param>
    [HttpPost("forgotPassword")]
    [AllowAnonymous]
    public async Task<ActionResult> Recovery(
        [FromBody] PasswordForgotRequest passwordForgot
    )
    {
        var services = HttpContext.RequestServices;
        var userManager = services.GetRequiredService<UserManager<Player>>();
        
        var user = await userManager.FindByEmailAsync(passwordForgot.Email);

        // don't reveal the idiots that the user does not exist.
        if (user is null) return Ok();
        
        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        await _emailService.SendPasswordResetCodeAsync(user, passwordForgot.Email, code);
        
        return Ok();
    }
    
    /// <summary>
    ///     Perform a password reset.
    /// </summary>
    /// <param name="passwordReset">Request body.</param>
    [HttpPost("resetPassword")]
    [AllowAnonymous]
    public async Task<ActionResult> ResetPassword(
        [FromBody] PasswordResetRequest passwordReset
    )
    {
        var services = HttpContext.RequestServices;
        var userManager = services.GetRequiredService<UserManager<Player>>();
        
        var user = await userManager.FindByEmailAsync(passwordReset.Email);

        // don't reveal the idiots that the user does not exist.
        if (user is null) return Ok();

        var result = await userManager.ResetPasswordAsync(user, passwordReset.Code, passwordReset.NewPassword);
        
        return result.Succeeded ? Ok() : BadRequest(result.ToString());
    }

    /// <summary>
    ///     Create an email/account verification request.
    /// </summary>
    [HttpGet("createEmailConfirmation")]
    [Authorize]
    public async Task<ActionResult> ConfirmEmail()
    {
        var services = HttpContext.RequestServices;
        var userManager = services.GetRequiredService<UserManager<Player>>();
        var user = await userManager.GetUserAsync(User);
        
        // ok I guess?
        if (await userManager.IsEmailConfirmedAsync(user!)) return Ok();

        var token = await userManager.GenerateEmailConfirmationTokenAsync(user!);
        
        var scheme = HttpContext.Request.Scheme;
        var authorityUrl = HttpContext.Request.Host.Value;
        
        var confirmationUrl = $"{scheme}://{authorityUrl}/api/verifyEmail?token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token))}";
        
        await _emailService.SendConfirmationLinkAsync(user!, user!.Email!, confirmationUrl);
        
        return Ok();
    }

    /// <summary>
    ///     Verify email.
    /// </summary>
    [HttpGet("verifyEmail")]
    [Authorize]
    public async Task<ActionResult> VerifyEmail([Required] string token)
    {
        var services = HttpContext.RequestServices;
        var userManager = services.GetRequiredService<UserManager<Player>>();
        var user = await userManager.GetUserAsync(User);

        var result = await userManager.ConfirmEmailAsync(user!, token);

        if (!result.Succeeded) return BadRequest(result.ToString());
        
        return Ok();
    }
}