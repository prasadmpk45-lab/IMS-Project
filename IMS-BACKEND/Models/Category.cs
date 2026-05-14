using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IMSBackend.Models
{
    [Table("categories")]
    public class Category
    {
        [Key]
        [Column("category_id")]
        public int CategoryId { get; set; }

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("parent_id")]   // ✅ THIS IS THE FIX
        public int? ParentId { get; set; }

        [Column("description")]
        public string Description { get; set; } = string.Empty;
    }
}