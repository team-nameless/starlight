using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Starlight.Backend.Attributes;
using Starlight.Backend.Controller.Request;
using Starlight.Backend.Enum;

namespace Starlight.Backend.Controller;

[Route("/api")]
[ApiController]
public class SessionController : ControllerBase
{
    [HttpPost("/register")]
    public IActionResult Register([FromBody] RegisterForm registerRequest)
    {
        // TODO: Ask the FE team what is the landing page route.
        return Redirect("");
    }

    [HttpPost("/login")]
    [RequireRole(UserRole.Anonymous)]
    public IActionResult Login()
    {
        // TODO: Ask the FE team what is the landing page route.
        return Redirect("");
    }

    [HttpPost("/logout")]
    [RequireRole(UserRole.Regular)]
    public IActionResult Logout()
    {
        // TODO: Ask the FE team what is the landing page route.
        return Redirect("");
    }
}