using IMSBackend.Data;
using IMSBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuppliersController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Suppliers.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier == null) return NotFound();

            return Ok(supplier);
        }

        // =========================
        // 🔹 CREATE
        // =========================
        [HttpPost]
        public IActionResult Create(Supplier supplier)
        {
            supplier.CreatedAt = DateTime.Now;

            _context.Suppliers.Add(supplier);
            _context.SaveChanges();

            return Ok(supplier);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Supplier updated)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier == null) return NotFound();

            supplier.Name = updated.Name;
            supplier.SupplierCode = updated.SupplierCode;
            supplier.GstNumber = updated.GstNumber;
            supplier.PanNumber = updated.PanNumber;
            supplier.Phone = updated.Phone;
            supplier.Email = updated.Email;
            supplier.Website = updated.Website;
            supplier.Status = updated.Status;
            supplier.UpdatedAt = DateTime.Now;

            _context.SaveChanges();

            return Ok(supplier);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var supplier = _context.Suppliers.Find(id);
            if (supplier == null) return NotFound();

            _context.Suppliers.Remove(supplier);
            _context.SaveChanges();

            return Ok();
        }
    }
}