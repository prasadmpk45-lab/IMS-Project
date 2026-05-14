namespace IMSBackend.DTOs
{
    public class CategoryDto
    {
        public string Name { get; set; } = string.Empty;

        public int? ParentId { get; set; }

        public string Description { get; set; } = string.Empty;
    }
}