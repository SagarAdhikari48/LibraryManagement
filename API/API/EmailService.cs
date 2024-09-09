using System.Net;
using System.Net.Mail;

namespace API;

public class EmailService
{
    private readonly IConfiguration _configuration;
    public EmailService(IConfiguration configuration)
    {
        this._configuration = configuration;
    }

    public void SendEmail(string toEmail, string subject, string body)
    {
        var fromEmail = _configuration.GetSection("Constants:FromEmail").Value ?? string.Empty;
        var fromEmailPass = _configuration.GetSection("Constants:FromEmailPass").Value ?? string.Empty;
        var message = new MailMessage()
        {
            From = new MailAddress(fromEmail),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };
        message.To.Add(toEmail);

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            EnableSsl = true,
            Port = 587,
            Credentials = new NetworkCredential(fromEmail, fromEmailPass)
        };
        smtpClient.Send(message);
    }
    
}