using API.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/[controller]")]
[ApiController]

public class SocialLoginController : Controller
{
    private readonly JwtService _jwtService;

    public SocialLoginController(JwtService jwtService )
    {
        this._jwtService = jwtService;
    }
    
    [HttpPost("google-login")]
    public async Task<ActionResult> GoogleLogin([FromBody] GoogleLoginDTO model)
    {
        var idToken = model.IdToken;
        var setting = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new string[] {"337726289519-nosgebo7062a1tc27qc336j1o5prte8t.apps.googleusercontent.com"},
        };
       var result = await GoogleJsonWebSignature.ValidateAsync(idToken, setting);
       if (result == null)
       {
           return BadRequest();
       }

       var newUser = new User()
       {
        Id = 0,
         FirstName = result.GivenName,
         LastName = result.FamilyName,
         Email = result.Email,
         Password = string.Empty,
         AccountStatus = AccountStatus.ACTIVE,
         CreatedOn = DateTime.Now,
         PhoneNumber = string.Empty,
         UserType = UserType.STUDENT
       };
       var generatedToken = new { token = _jwtService.GenerateToken(newUser) };
       return Ok(generatedToken);
    }
}