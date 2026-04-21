using Microsoft.EntityFrameworkCore;
using Infrastructure.Data.WebApp.Context;
using Infrastructure.Data.WebApp.Entities;
using backend.Services;
using backend.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// 1. ลงทะเบียน Service ต่างๆ (Add Services)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddDbContext<WebAppEntity>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextjs",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

builder.Services.AddScoped<IUserService, UserService>();
// --- บรรทัดนี้ต้องมีที่เดียว! ---
var app = builder.Build();

// 2. ตั้งค่า HTTP Request Pipeline (Middleware)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// เรียกใช้ CORS Policy ที่สร้างไว้
app.UseCors("AllowNextjs");

app.UseAuthorization();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.MapControllers();

app.Run();