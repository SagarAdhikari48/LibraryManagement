using API;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<Context>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DB"));
});
builder.Services.AddCors(c => c.AddPolicy("myCorsPolicy", policy =>
{
    policy.WithOrigins("http://localhost:4200/").AllowAnyHeader().AllowAnyOrigin();
}));

builder.Services.AddScoped<EmailService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("myCorsPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();