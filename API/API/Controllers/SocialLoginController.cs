using API.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]

public class SocialLoginController : Controller
{
    private readonly JwtService _jwtService;
    private readonly Context _context;


    public SocialLoginController(JwtService jwtService, Context context)
    {
        this._jwtService = jwtService;
        this._context = context;
    }

    [HttpPost("google-login")]
    public async Task<ActionResult> GoogleLogin([FromBody] GoogleLoginDTO model)
    {
        var idToken = model.IdToken;
        var setting = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new string[] { "337726289519-nosgebo7062a1tc27qc336j1o5prte8t.apps.googleusercontent.com" },
        };

        GoogleJsonWebSignature.Payload result;
        try
        {
            result = await GoogleJsonWebSignature.ValidateAsync(idToken, setting);
        }
        catch (Exception ex)
        {
            return BadRequest($"Token validation failed: {ex.Message}");
        }

        if (result == null)
        {
            return BadRequest("Invalid Google token.");
        }

        // Check if the user exists in the database
        var existingUser = _context.Users.FirstOrDefault(u => u.Email == result.Email); // Find user by email
        User user;
        if (existingUser == null)
        {
            user = new User()
            {
                FirstName = result.GivenName ?? string.Empty,
                LastName = result.FamilyName ?? string.Empty,
                Email = result.Email ?? string.Empty,
                Password = string.Empty, // Google login does not provide a password
                AccountStatus = AccountStatus.ACTIVE,
                CreatedOn = DateTime.Now,
                PhoneNumber = string.Empty, // Assuming phone number is not provided by Google
                UserType = UserType.STUDENT // Set default user type; adjust as needed
            };

            // Add the new user to the database
            _context.Users.Add(user);
            await _context.SaveChangesAsync(); // Save changes to get the new ID
        }
        else
        {
            user = existingUser;
        }

        // Generate JWT token
        var generatedToken = new { token = _jwtService.GenerateToken(user) };
        return Ok(generatedToken);
    }

}
