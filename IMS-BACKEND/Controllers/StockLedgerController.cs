using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-ledger")]
    public class StockLedgerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockLedgerController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockLedgers.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var ledger = _context.StockLedgers.Find(id);

            if (ledger == null)
                return NotFound();

            return Ok(ledger);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockLedgerDto dto)
        {
            var ledger = new StockLedger
            {
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                WarehouseId = dto.WarehouseId,
                OpeningQty = dto.OpeningQty,
                ChangeQty = dto.ChangeQty,
                ClosingQty = dto.ClosingQty,
                TransactionType = dto.TransactionType,
                TransactionId = dto.TransactionId,
                CreatedAt = DateTime.Now
            };

            _context.StockLedgers.Add(ledger);
            _context.SaveChanges();

            return Ok(ledger);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockLedgerDto dto)
        {
            var ledger = _context.StockLedgers.Find(id);

            if (ledger == null)
                return NotFound();

            ledger.ProductId = dto.ProductId;
            ledger.VariantId = dto.VariantId;
            ledger.WarehouseId = dto.WarehouseId;
            ledger.OpeningQty = dto.OpeningQty;
            ledger.ChangeQty = dto.ChangeQty;
            ledger.ClosingQty = dto.ClosingQty;
            ledger.TransactionType = dto.TransactionType;
            ledger.TransactionId = dto.TransactionId;

            _context.SaveChanges();

            return Ok(ledger);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ledger = _context.StockLedgers.Find(id);

            if (ledger == null)
                return NotFound();

            _context.StockLedgers.Remove(ledger);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}