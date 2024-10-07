using Microsoft.AspNetCore.Mvc.Filters;
using Starlight.Backend.Enum;

namespace Starlight.Backend.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequireRoleAttribute : Attribute, IAsyncAuthorizationFilter
{
    private UserRole _role;

    public RequireRoleAttribute(UserRole role)
    {
        _role = role;
    }

    public Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        return Task.CompletedTask;
    }
}