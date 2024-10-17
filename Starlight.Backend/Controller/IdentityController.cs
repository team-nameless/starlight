using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Starlight.Backend.Controller.Request.Session;
using Starlight.Backend.Database.Game;
using Starlight.Backend.Service;

namespace Starlight.Backend.Controller;

[Route("/api")]
[ApiController]
public class IdentityController : ControllerBase
{
    private GameDatabaseService _gameDatabase;

    public IdentityController(GameDatabaseService gameDatabase)
    {
        _gameDatabase = gameDatabase;
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
            CurrentLevel = 1,
            SequenceNumber = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
        };
        
        await userStore.SetUserNameAsync(user, registration.Handle, CancellationToken.None);
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
}