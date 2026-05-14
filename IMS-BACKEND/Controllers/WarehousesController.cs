using IMSBackend.Data;
using IMSBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehousesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WarehousesController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Warehouses.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound();

            return Ok(warehouse);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(Warehouse warehouse)
        {
            warehouse.CreatedAt = DateTime.Now;

            _context.Warehouses.Add(warehouse);
            _context.SaveChanges();

            return Ok(warehouse);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Warehouse updated)
        {
            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound();

            warehouse.Name = updated.Name;
            warehouse.Location = updated.Location;
            warehouse.Status = updated.Status;

            _context.SaveChanges();

            return Ok(warehouse);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var warehouse = _context.Warehouses.Find(id);
            if (warehouse == null) return NotFound();

            _context.Warehouses.Remove(warehouse);
            _context.SaveChanges();

            return Ok();
        }
    }
}