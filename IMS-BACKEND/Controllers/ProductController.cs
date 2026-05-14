using Microsoft.AspNetCore.Mvc;
using IMSBackend.Data;
using IMSBackend.Models;
using IMSBackend.DTOs;

namespace IMSBackend.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🔹 GET ALL PRODUCTS
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.Products.ToList());
        }

        // =========================
        // 🔹 GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            return Ok(product);
        }

        // =========================
        // 🔹 BASIC CREATE
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] Product product)
        {
            if (product == null)
                return BadRequest("Invalid product data");

            // ✅ Check duplicate SKU
            if (_context.Products.Any(p => p.SKU == product.SKU))
                return BadRequest("SKU already exists");

            product.CreatedAt = DateTime.Now;

            _context.Products.Add(product);
            _context.SaveChanges();

            return Ok(product);
        }

        // =========================
        // 🔥 FULL CREATE / UPDATE
        // =========================
        [HttpPost("full")]
        public IActionResult CreateFull(ProductDto dto)
        {
            // 🔹 STEP 1: CHECK PRODUCT
            var existingProduct = _context.Products
                .FirstOrDefault(p => p.SKU == dto.SKU);

            Product product;

            if (existingProduct != null)
            {
                // UPDATE
                product = existingProduct;

                product.Name = dto.Name;
                product.Price = dto.Price;
                product.Stock = dto.Stock;
                product.CostPrice = dto.CostPrice;
                product.Description = dto.Description;
            }
            else
            {
                // CREATE
                product = new Product
                {
                    Name = dto.Name,
                    SKU = dto.SKU,
                    Barcode = dto.Barcode,
                    CategoryId = dto.CategoryId,
                    BrandId = dto.BrandId,
                    UnitId = dto.UnitId,
                    Price = dto.Price,
                    CostPrice = dto.CostPrice,
                    Stock = dto.Stock,
                    ReorderLevel = dto.ReorderLevel,
                    SupplierId = dto.SupplierId,
                    WarehouseId = dto.WarehouseId,
                    Status = dto.Status,
                    Description = dto.Description,
                    CreatedAt = DateTime.Now
                };

                _context.Products.Add(product);
            }

            _context.SaveChanges();

            // =========================
            // 🔹 STEP 2: SAVE VARIANTS
            // =========================
            if (dto.Variants != null)
            {
                foreach (var v in dto.Variants)
                {
                    var existingVariant = _context.ProductVariants
                        .FirstOrDefault(x => x.SKU == v.SKU && x.ProductId == product.ProductId);

                    ProductVariant variant;

                    if (existingVariant != null)
                    {
                        // UPDATE VARIANT
                        variant = existingVariant;
                        variant.VariantName = v.VariantName;
                        variant.Price = v.PriceDelta;
                        variant.CostPrice = v.StockDelta;
                    }
                    else
                    {
                        // CREATE VARIANT
                        variant = new ProductVariant
                        {
                            ProductId = product.ProductId,
                            VariantName = v.VariantName,
                            SKU = v.SKU,
                            Price = v.PriceDelta,
                            CostPrice = v.StockDelta
                        };

                        _context.ProductVariants.Add(variant);
                    }

                    _context.SaveChanges(); // ✅ VERY IMPORTANT

                    // SAFETY CHECK
                    if (variant.VariantId == 0)
                        return BadRequest("Variant not saved properly");

                    // =========================
                    // 🔹 STEP 3: SAVE ATTRIBUTES (FIXED)
                    // =========================
                    if (v.Attributes != null)
                    {
                        foreach (var attr in v.Attributes)
                        {
                            // ✅ Check Attribute exists
                            var attributeExists = _context.Attributes
                                .Any(a => a.AttributeId == attr.AttributeId);

                            if (!attributeExists)
                                return BadRequest($"Invalid AttributeId: {attr.AttributeId}");

                            // ✅ Check Value exists
                            var valueExists = _context.AttributeValues
                                .Any(vv => vv.ValueId == attr.ValueId);

                            if (!valueExists)
                                return BadRequest($"Invalid ValueId: {attr.ValueId}");

                            // ✅ Avoid duplicate mapping
                            var alreadyExists = _context.VariantAttributeValues.Any(a =>
                                a.VariantId == variant.VariantId &&
                                a.AttributeId == attr.AttributeId &&
                                a.ValueId == attr.ValueId);

                            if (!alreadyExists)
                            {
                                _context.VariantAttributeValues.Add(new VariantAttributeValue
                                {
                                    VariantId = variant.VariantId,
                                    AttributeId = attr.AttributeId,
                                    ValueId = attr.ValueId
                                });
                            }
                        }
                    }
                }
            }

            _context.SaveChanges();

            return Ok(product);
        }

        // =========================
        // 🔹 UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Product updated)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            // ✅ Check duplicate SKU
            var duplicate = _context.Products
                .FirstOrDefault(p => p.SKU == updated.SKU && p.ProductId != id);

            if (duplicate != null)
                return BadRequest("SKU already exists");

            product.Name = updated.Name;
            product.SKU = updated.SKU;
            product.Price = updated.Price;
            product.CostPrice = updated.CostPrice;
            product.Stock = updated.Stock;

            _context.SaveChanges();

            return Ok(product);
        }

        // =========================
        // 🔹 DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok();
        }
    }
}