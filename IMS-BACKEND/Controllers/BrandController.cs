using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/brands")]
    public class BrandController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BrandController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Brands.ToList());
        }

        // CREATE
        [HttpPost]
        public IActionResult Create([FromBody] Brand brand)
        {
            _context.Brands.Add(brand);
            _context.SaveChanges();

            return Ok(brand);
        }

        // UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Brand updated)
        {
            var brand = _context.Brands.Find(id);
            if (brand == null) return NotFound();

            brand.Name = updated.Name;
            brand.Description = updated.Description;

            _context.SaveChanges();

            return Ok(brand);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var brand = _context.Brands.Find(id);
            if (brand == null) return NotFound();

            _context.Brands.Remove(brand);
            _context.SaveChanges();

            return Ok();
        }
    }
}