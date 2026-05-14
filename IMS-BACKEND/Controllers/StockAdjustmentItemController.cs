using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-adjustment-items")]
    public class StockAdjustmentItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockAdjustmentItemController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockAdjustmentItems.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _context.StockAdjustmentItems.Find(id);

            if (item == null)
                return NotFound();

            return Ok(item);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockAdjustmentItemDto dto)
        {
            // Check Adjustment
            var adjustment = _context.StockAdjustments.Find(dto.AdjustmentId);

            if (adjustment == null)
                return BadRequest("Invalid AdjustmentId");

            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            var item = new StockAdjustmentItem
            {
                AdjustmentId = dto.AdjustmentId,
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                Quantity = dto.Quantity
            };

            _context.StockAdjustmentItems.Add(item);

            // OPTIONAL: update stock
            if (adjustment.AdjustmentType == "increase")
            {
                product.Stock = (product.Stock ?? 0) + (int)dto.Quantity;
            }
            else if (adjustment.AdjustmentType == "decrease")
            {
                product.Stock = (product.Stock ?? 0) - (int)dto.Quantity;
            }

            _context.SaveChanges();

            return Ok(item);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockAdjustmentItemDto dto)
        {
            var item = _context.StockAdjustmentItems.Find(id);

            if (item == null)
                return NotFound();

            item.AdjustmentId = dto.AdjustmentId;
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
            var item = _context.StockAdjustmentItems.Find(id);

            if (item == null)
                return NotFound();

            _context.StockAdjustmentItems.Remove(item);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}