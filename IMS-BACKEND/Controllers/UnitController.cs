using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.Models;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/units")]
    public class UnitController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UnitController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET ALL UNITS
        [HttpGet]
        public IActionResult GetAll()
        {
            var units = _context.Units.ToList();
            return Ok(units);
        }

        // ✅ GET UNIT BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var unit = _context.Units.Find(id);

            if (unit == null)
                return NotFound("Unit not found");

            return Ok(unit);
        }

        // ✅ CREATE UNIT
        [HttpPost]
        public IActionResult Create([FromBody] Unit unit)
        {
            if (string.IsNullOrWhiteSpace(unit.Name))
                return BadRequest("Unit name is required");

            if (string.IsNullOrWhiteSpace(unit.ShortName))
                return BadRequest("Short name is required");

            _context.Units.Add(unit);
            _context.SaveChanges();

            return Ok(unit);
        }

        // ✅ UPDATE UNIT
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Unit updated)
        {
            var unit = _context.Units.Find(id);

            if (unit == null)
                return NotFound("Unit not found");

            unit.Name = updated.Name;
            unit.ShortName = updated.ShortName;

            _context.SaveChanges();

            return Ok(unit);
        }

        // ✅ DELETE UNIT
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var unit = _context.Units.Find(id);

            if (unit == null)
                return NotFound("Unit not found");

            _context.Units.Remove(unit);
            _context.SaveChanges();

            return Ok("Unit deleted successfully");
        }
    }
}