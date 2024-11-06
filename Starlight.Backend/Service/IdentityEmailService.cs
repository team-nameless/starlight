using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Starlight.Backend.Database.Game;

namespace Starlight.Backend.Service;

public class IdentityEmailService : IEmailSender<Player>
{
    private IConfiguration _configuration;

    public IdentityEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public Task SendConfirmationLinkAsync(Player user, string email, string confirmationLink)
    {
        throw new NotImplementedException();
    }

    public Task SendPasswordResetLinkAsync(Player user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }

    public async Task SendPasswordResetCodeAsync(Player user, string email, string resetCode)
    {
        var host = _configuration.GetValue<string>("Email:Host") ?? "localhost";
        var port = _configuration.GetValue<int>("Email:Port");
        var sender = _configuration.GetValue<string>("Email:Sender") ?? "i.do.not@exist.here";
        var auth = _configuration.GetValue<string>("Email:Auth") ?? "youshallnotpass";

        var message = new MailMessage
        {
            Subject = "Password Reset Code",
            From = new MailAddress(sender, "Team Starlight"),
            To =
            {
                new MailAddress(email)
            },
            Body = $"""
                   Dear {user.UserName},
                   
                   We heard that you want to reset your password.
                   If you are the one that requested this, keep reading, or else, feel free to ignore.
                   
                   Your reset code is: {resetCode}
                   
                   Regards,
                   Team Starlight.
                   """
        };

        using var client = new SmtpClient(host, port);

        client.Credentials = new NetworkCredential(sender, auth);
        await client.SendMailAsync(message);
    }
}