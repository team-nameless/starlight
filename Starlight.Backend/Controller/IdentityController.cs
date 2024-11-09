using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Starlight.Backend.Controller.Request.Identity;
using Starlight.Backend.Database.Game;
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
    public async Task<ActionResult> Register(
        [FromBody] RegisterForm registration
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
            SequenceNumber = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
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
    public async Task<ActionResult> Login(
        [FromBody] LoginForm login
    )
    {
        var services = HttpContext.RequestServices;
        var signInManager = services.GetRequiredService<SignInManager<Player>>();
        
        var attemptedUser = _gameDatabase.Users.FirstOrDefault(x => x.Email == login.Email);

        if (attemptedUser == null)
        {
            return Unauthorized("User not found.");
        }
        
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
    public async Task<ActionResult> Recovery(
        [FromBody] PasswordForgotForm passwordForgot
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
    public async Task<ActionResult> ResetPassword(
        [FromBody] PasswordResetForm passwordReset
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
}