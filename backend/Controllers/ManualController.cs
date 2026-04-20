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
        public async Task<IActionResult> GetManuals()
        {
            var result = await _manualService.GetManualsAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetManualById(int id)
        {
            var result = await _manualService.GetManualByIdAsync(id);

            if (result == null) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateManual([FromForm] string title, [FromForm] string system, [FromForm] string status, [FromForm] int? createdBy, [FromForm] int id = 0)
        {
            try
            {
                var result = await _manualService.CreateManualAsync(title, system, status, createdBy, id);
                return CreatedAtAction(nameof(GetManuals), result, new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // 3. PUT: api/manual/{id} (แก้ไขข้อมูล)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateManual(int id, [FromBody] UpdateManual request)
        {
            var result = await _manualService.UpdateManualAsync(id, request);

            if (result == null)
                return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            return Ok(new
            {
                success = true,
                data = result
            });
        }

        // 4. DELETE: api/manual/{id} (ลบข้อมูล)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManual(int id)
        {
            var success = await _manualService.DeleteManualAsync(id);
            if (!success) return NotFound(new { error = "ไม่พบข้อมูลคู่มือ" });

            return Ok(new { success = true });
        }

        // 5. DELETE: api/manual/bulk (ลบข้อมูลหลายรายการ)
        [HttpDelete("bulk")]
        public async Task<IActionResult> DeleteManuals([FromBody] List<int> ids)
        {
            var success = await _manualService.DeleteManualsAsync(ids);
            if (!success) return NotFound(new { error = "ไม่พบข้อมูลที่ต้องการลบ" });

            return Ok(new { success = true });
        }

        [HttpPut("reorder")]
        public async Task<IActionResult> ReorderManuals([FromBody] List<ReorderRequest> items)
        {
            try
            {
                await _manualService.ReorderManualsAsync(items);
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