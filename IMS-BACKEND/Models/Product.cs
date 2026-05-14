using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IMSBackend.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int ProductId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string SKU { get; set; } = string.Empty;

        [Column("category_id")]
        public int? CategoryId { get; set; }

        [Column("brand_id")]
        public int? BrandId { get; set; }

        [Column("unit_id")]
        public int? UnitId { get; set; }

        public decimal? Price { get; set; }

        [Column("cost_price")]
        public decimal? CostPrice { get; set; }

        public string Barcode { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Status { get; set; } = "active";

        // 🔥 ADD THESE
        [Column("stock")]
        public int? Stock { get; set; }

        [Column("reorder_level")]
        public int? ReorderLevel { get; set; }

        [Column("supplier_id")]
        public int? SupplierId { get; set; }

        [Column("warehouse_id")]
        public int? WarehouseId { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}