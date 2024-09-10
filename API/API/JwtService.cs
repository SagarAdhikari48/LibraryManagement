using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using Microsoft.IdentityModel.Tokens;

namespace API;

public class JwtService
{
    private readonly string key = string.Empty;
    private readonly int duration;
    
    private readonly IConfiguration _configuration;
    
    public JwtService(IConfiguration configuration)
    {
        key = configuration["Jwt:Key"]!;
        duration = int.Parse(configuration["Jwt:Duration"]!);
        // this._configuration = configuration;
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.key));
        var signingKey = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
           new Claim("id",user.Id.ToString()),
           new Claim("FirstName",user.FirstName),
           new Claim("LastName",user.LastName),
           new Claim("PhoneNumber",user.PhoneNumber),
           new Claim("Email",user.Email),
           new Claim("UserType",user.UserType.ToString()),
           new Claim("AccountStatus",user.AccountStatus.ToString()),
           new Claim("CreatedOn",user.CreatedOn.ToString())
        };
        var jwtToken = new JwtSecurityToken(
            issuer: "localhost",
            audience: "localhost",
            claims: claims,
            notBefore: DateTime.Now,
            expires: DateTime.Now.AddMinutes(this.duration),
            signingKey
        );
        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }
    
}