using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LibraryController : ControllerBase
    {
        private readonly Context _context;
        private readonly EmailService _emailService;
        
        public LibraryController(Context context, EmailService emailService)
        {
            this._context = context;
            this._emailService = emailService;
        }

        [HttpPost("Register")]
        public  ActionResult Register(User user)
        {
            
            user.UserType = UserType.STUDENT;
            user.AccountStatus = AccountStatus.UNAPPROVED;
            user.CreatedOn = DateTime.Now;
            _context.Users.Add(user);
            _context.SaveChanges();
            const string subject = "Account Created!";
            var body = $"""
                            <html>
                                <body>
                                    <h1>Hello, {user.FirstName} {user.LastName}</h1>
                                    <h2>
                                        Your account has been created and we have sent approval request to admin. 
                                        Once the request is approved by admin you will receive email, and you will be
                                        able to login in to your account.
                                    </h2>
                                    <h3>Thanks</h3>
                                </body>
                            </html>
                        """;
            _emailService.SendEmail(user.Email, subject, body);
            return Ok("Thank you for registering user. Your account has been sent for approval.Once it is approved you will get an email!");
            
        }
    }  
}
