using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-transfers")]
    public class StockTransferController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockTransferController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockTransfers.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var transfer = _context.StockTransfers.Find(id);

            if (transfer == null)
                return NotFound();

            return Ok(transfer);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockTransferDto dto)
        {
            // Check warehouses
            var fromWarehouse = _context.Warehouses.Find(dto.FromWarehouseId);

            if (fromWarehouse == null)
                return BadRequest("Invalid FromWarehouseId");

            var toWarehouse = _context.Warehouses.Find(dto.ToWarehouseId);

            if (toWarehouse == null)
                return BadRequest("Invalid ToWarehouseId");

            var transfer = new StockTransfer
            {
                FromWarehouseId = dto.FromWarehouseId,
                ToWarehouseId = dto.ToWarehouseId,
                TransferDate = dto.TransferDate,
                Status = dto.Status
            };

            _context.StockTransfers.Add(transfer);
            _context.SaveChanges();

            return Ok(transfer);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockTransferDto dto)
        {
            var transfer = _context.StockTransfers.Find(id);

            if (transfer == null)
                return NotFound();

            transfer.FromWarehouseId = dto.FromWarehouseId;
            transfer.ToWarehouseId = dto.ToWarehouseId;
            transfer.TransferDate = dto.TransferDate;
            transfer.Status = dto.Status;

            _context.SaveChanges();

            return Ok(transfer);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var transfer = _context.StockTransfers.Find(id);

            if (transfer == null)
                return NotFound();

            _context.StockTransfers.Remove(transfer);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}