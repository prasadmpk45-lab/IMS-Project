using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock")]
    public class StockController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Stocks.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var stock = _context.Stocks.Find(id);

            if (stock == null)
                return NotFound();

            return Ok(stock);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockDto dto)
        {
            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            // Check Warehouse
            var warehouse = _context.Warehouses.Find(dto.WarehouseId);

            if (warehouse == null)
                return BadRequest("Invalid WarehouseId");

            var stock = new Stock
            {
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                WarehouseId = dto.WarehouseId,
                Quantity = dto.Quantity,
                ReservedQuantity = dto.ReservedQuantity
            };

            _context.Stocks.Add(stock);
            _context.SaveChanges();

            return Ok(stock);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockDto dto)
        {
            var stock = _context.Stocks.Find(id);

            if (stock == null)
                return NotFound();

            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            // Check Warehouse
            var warehouse = _context.Warehouses.Find(dto.WarehouseId);

            if (warehouse == null)
                return BadRequest("Invalid WarehouseId");

            stock.ProductId = dto.ProductId;
            stock.VariantId = dto.VariantId;
            stock.WarehouseId = dto.WarehouseId;
            stock.Quantity = dto.Quantity;
            stock.ReservedQuantity = dto.ReservedQuantity;

            _context.SaveChanges();

            return Ok(stock);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var stock = _context.Stocks.Find(id);

            if (stock == null)
                return NotFound();

            _context.Stocks.Remove(stock);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}