using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Starlight.Backend.Database.Game;

namespace Starlight.Backend.Service;

public class StarlightEmailService
{
    private IConfiguration _configuration;

    public StarlightEmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    
    public async Task SendNewPasswordEmail(string email, string newPassword)
    {
        var host = _configuration.GetValue<string>("Email:Host") ?? "localhost";
        var port = _configuration.GetValue<int>("Email:Port");
        var sender = _configuration.GetValue<string>("Email:Sender") ?? "i.do.not@exist.here";
        var auth = _configuration.GetValue<string>("Email:Auth") ?? "youshallnotpass";

        var message = new MailMessage
        {
            Subject = "Password Reset",
            From = new MailAddress(sender, "Team Starlight"),
            To =
            {
                new MailAddress(email)
            },
            Body = $"""
                   Dear {email},
                   
                   We heard that you want to reset your password.
                   If you are the one that requested this, keep reading, or else, feel free to ignore.
                   
                   Your temporary password is: {newPassword}
                   Make sure to change new password at the profile configuration page.
                   
                   Regards,
                   Team Starlight.
                   """
        };

        using var client = new SmtpClient(host, port);

        client.Credentials = new NetworkCredential(sender, auth);
        await client.SendMailAsync(message);
    }
}