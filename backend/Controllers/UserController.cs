using Microsoft.AspNetCore.Mvc;
using Infrastructure.Data.WebApp.Entities;
using backend.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<tbPosts>> GetPosts()
        => Ok(_userService.GetAllPosts());

    [HttpGet("GetLocation")]
    public ActionResult<IEnumerable<tbLocation>> GetLocation()
        => Ok(_userService.GetAllLocation());
    
    [HttpGet("GetStatus")]
    public ActionResult<IEnumerable<tbStatus>> GetStatus()
        => Ok(_userService.GetAllStatus());

    [HttpGet("GetTypePost")]
    public ActionResult<IEnumerable<tbTypePost>> GetTypePost()
        => Ok(_userService.GetAllTypePost());

    [HttpGet("{id}")]
    public ActionResult<tbPosts> GetPost(int id)
    {
        var user = _userService.GetUserById(id);
        return user == null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public ActionResult<tbPosts> PostUser(tbPosts user)
    {
        var result = _userService.SaveUser(user);
        return CreatedAtAction(nameof(GetPost), new { id = result.nId }, result);
    }

    [HttpDelete("{id}")]
    public IActionResult DeletePost(int id)
    {
        var result = _userService.DeleteUser(id);
        return NoContent();
    }
}