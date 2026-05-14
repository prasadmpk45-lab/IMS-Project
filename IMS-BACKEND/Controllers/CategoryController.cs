using IMSBackend.Data;
using IMSBackend.DTOs;
using IMSBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoryController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Categories.ToList());
        }

        // GET MAIN CATEGORIES
        [HttpGet("main")]
        public IActionResult GetMain()
        {
            var data = _context.Categories
                .Where(c => c.ParentId == null)
                .ToList();

            return Ok(data);
        }

        // GET SUBCATEGORIES
        [HttpGet("sub/{parentId}")]
        public IActionResult GetSub(int parentId)
        {
            var data = _context.Categories
                .Where(c => c.ParentId == parentId)
                .ToList();

            return Ok(data);
        }

        // CREATE
        [HttpPost]
        public IActionResult Create(CategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                ParentId = dto.ParentId,
                Description = dto.Description
            };

            _context.Categories.Add(category);
            _context.SaveChanges();

            return Ok(category);
        }

        // UPDATE
        [HttpPut("{id}")]
        public IActionResult Update(int id, Category updated)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            category.Name = updated.Name;
            category.ParentId = updated.ParentId;
            category.Description = updated.Description;

            _context.SaveChanges();

            return Ok(category);
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null) return NotFound();

            _context.Categories.Remove(category);
            _context.SaveChanges();

            return Ok();
        }
    }
}