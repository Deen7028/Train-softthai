// Controllers/ManualController.cs
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManualController : ControllerBase
    {
        private readonly IManualService _manualService;

        public ManualController(IManualService manualService)
        {
            _manualService = manualService;
        }

        [HttpGet]
        public IActionResult GetManuals()
        {
            var result = _manualService.GetManuals();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public IActionResult GetManualById(int id)
        {
            var result = _manualService.GetManualById(id);

            if (result == null) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            return Ok(result);
        }

        [HttpPost]
        public IActionResult CreateManual([FromForm] string title, [FromForm] string system, [FromForm] string status, [FromForm] int? createdBy, [FromForm] int id = 0)
        {
            try
            {
                var result = _manualService.CreateManual(title, system, status, createdBy, id);
                return CreatedAtAction(nameof(GetManuals), result, new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // 4. DELETE: api/manual/{id} (ลบข้อมูล)
        [HttpDelete("{id}")]
        public IActionResult DeleteManual(int id)
        {
            try
            {
                var success = _manualService.DeleteManual(id);
                if (!success) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        // 5. DELETE: api/manual/bulk (ลบข้อมูลหลายรายการ)
        [HttpDelete("bulk")]
        public IActionResult DeleteManuals([FromBody] List<int> ids)
        {
            try
            {
                var success = _manualService.DeleteManuals(ids);
                if (!success) return NotFound(new { error = "ไม่พบข้อมูลที่ต้องการลบ" });
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        [HttpPut("reorder")]
        public IActionResult ReorderManuals([FromBody] List<ReorderRequest> items)
        {
            try
            {
                _manualService.ReorderManuals(items);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "เกิดข้อผิดพลาดในการดึงข้อมูล: " + ex.Message });
            }
        }
    }

    public class ReorderRequest
    {
        public int Id { get; set; }
        public int Order { get; set; }
    }
}