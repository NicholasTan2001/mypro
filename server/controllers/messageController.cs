using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMessage()
        {
            return Ok(new
            {
                message = "Hello from .NET Backend!"
            });
        }
    }
}