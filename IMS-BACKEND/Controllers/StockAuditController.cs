using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-audits")]
    public class StockAuditController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockAuditController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockAudits.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var audit = _context.StockAudits.Find(id);

            if (audit == null)
                return NotFound();

            return Ok(audit);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockAuditDto dto)
        {
            // Check Warehouse
            var warehouse = _context.Warehouses.Find(dto.WarehouseId);

            if (warehouse == null)
                return BadRequest("Invalid WarehouseId");

            var audit = new StockAudit
            {
                WarehouseId = dto.WarehouseId,
                AuditDate = dto.AuditDate,
                AuditType = dto.AuditType,
                Status = dto.Status,
                CreatedBy = dto.CreatedBy,
                ApprovedBy = dto.ApprovedBy,
                Notes = dto.Notes
            };

            _context.StockAudits.Add(audit);
            _context.SaveChanges();

            return Ok(audit);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockAuditDto dto)
        {
            var audit = _context.StockAudits.Find(id);

            if (audit == null)
                return NotFound();

            audit.WarehouseId = dto.WarehouseId;
            audit.AuditDate = dto.AuditDate;
            audit.AuditType = dto.AuditType;
            audit.Status = dto.Status;
            audit.CreatedBy = dto.CreatedBy;
            audit.ApprovedBy = dto.ApprovedBy;
            audit.Notes = dto.Notes;

            _context.SaveChanges();

            return Ok(audit);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var audit = _context.StockAudits.Find(id);

            if (audit == null)
                return NotFound();

            _context.StockAudits.Remove(audit);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}