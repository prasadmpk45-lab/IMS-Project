using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/stock-movements")]
    public class StockMovementController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StockMovementController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.StockMovements.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var movement = _context.StockMovements.Find(id);

            if (movement == null)
                return NotFound();

            return Ok(movement);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(StockMovementDto dto)
        {
            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            // Check Warehouse
            var warehouse = _context.Warehouses.Find(dto.WarehouseId);

            if (warehouse == null)
                return BadRequest("Invalid WarehouseId");

            // Create movement
            var movement = new StockMovement
            {
                ProductId = dto.ProductId,
                VariantId = dto.VariantId,
                WarehouseId = dto.WarehouseId,
                MovementType = dto.MovementType,
                Quantity = dto.Quantity,
                ReferenceId = dto.ReferenceId,
                ReferenceType = dto.ReferenceType,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };

            _context.StockMovements.Add(movement);

            // OPTIONAL: Update product stock
            if (dto.MovementType == "purchase" || dto.MovementType == "return_in")
            {
                product.Stock += (int)dto.Quantity;
            }
            else if (dto.MovementType == "sale" || dto.MovementType == "return_out")
            {
                product.Stock -= (int)dto.Quantity;
            }

            _context.SaveChanges();

            return Ok(movement);
        }
        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, StockMovementDto dto)
        {
            var movement = _context.StockMovements.Find(id);

            if (movement == null)
                return NotFound("Stock movement not found");

            // Check Product
            var product = _context.Products.Find(dto.ProductId);

            if (product == null)
                return BadRequest("Invalid ProductId");

            // Check Warehouse
            var warehouse = _context.Warehouses.Find(dto.WarehouseId);

            if (warehouse == null)
                return BadRequest("Invalid WarehouseId");

            // Update values
            movement.ProductId = dto.ProductId;
            movement.VariantId = dto.VariantId;
            movement.WarehouseId = dto.WarehouseId;
            movement.MovementType = dto.MovementType;
            movement.Quantity = dto.Quantity;
            movement.ReferenceId = dto.ReferenceId;
            movement.ReferenceType = dto.ReferenceType;
            movement.Notes = dto.Notes;

            _context.SaveChanges();

            return Ok(movement);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var movement = _context.StockMovements.Find(id);

            if (movement == null)
                return NotFound();

            _context.StockMovements.Remove(movement);
            _context.SaveChanges();

            return Ok("Deleted successfully");
        }
    }
}