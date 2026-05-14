using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-transfer-items")]
    public class StockTransferItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockTransferItemController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockTransferItems.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _context.StockTransferItems.Find(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockTransferItemDto dto)
        {
            // Check Transfer
            var transfer = _context.StockTransfers.Find(dto.TransferId);

            if (transfer == null)
                return BadRequest("Invalid TransferId");

            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            var item = new StockTransferItem
            {
                TransferId = dto.TransferId,
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                Quantity = dto.Quantity
            };

            _context.StockTransferItems.Add(item);

            // OPTIONAL: stock update
            product.Stock = (product.Stock ?? 0) - (int)dto.Quantity;

            _context.SaveChanges();

            return Ok(item);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockTransferItemDto dto)
        {
            var item = _context.StockTransferItems.Find(id);

            if (item == null)
                return NotFound();

            item.TransferId = dto.TransferId;
            item.ProductId = dto.ProductId;
            item.VariantId = dto.VariantId;
            item.Quantity = dto.Quantity;

            _context.SaveChanges();

            return Ok(item);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.StockTransferItems.Find(id);

            if (item == null)
                return NotFound();

            _context.StockTransferItems.Remove(item);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}