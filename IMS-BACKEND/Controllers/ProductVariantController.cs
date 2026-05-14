using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.Models;
using IMSBackend.DTOs;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/productvariants")]
    public class ProductVariantController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductVariantController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 CREATE VARIANT
        // =========================
        [HttpPost("{productId}")]
        public IActionResult Create(int productId, ProductVariantCreateDto dto)
        {
            var product = _context.Products.Find(productId);
            if (product == null)
                return BadRequest("Invalid ProductId");

            var variant = new ProductVariant
            {
                ProductId = productId,
                VariantName = dto.VariantName,
                SKU = dto.SKU,
                Price = dto.PriceDelta,
                CostPrice = dto.StockDelta
            };

            _context.ProductVariants.Add(variant);
            _context.SaveChanges();

            return Ok(variant);
        }

        // =========================
        // 🔹 GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.ProductVariants.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var variant = _context.ProductVariants.Find(id);
            if (variant == null) return NotFound();

            return Ok(variant);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, ProductVariant updated)
        {
            var variant = _context.ProductVariants.Find(id);
            if (variant == null) return NotFound();

            variant.VariantName = updated.VariantName;
            variant.SKU = updated.SKU;
            variant.Price = updated.Price;
            variant.CostPrice = updated.CostPrice;

            _context.SaveChanges();

            return Ok(variant);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var variant = _context.ProductVariants.Find(id);
            if (variant == null) return NotFound();

            _context.ProductVariants.Remove(variant);
            _context.SaveChanges();

            return Ok();
        }
    }
}