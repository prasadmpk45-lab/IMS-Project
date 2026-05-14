namespace IMSBackend.DTOs
{
    public class StockTransferDto
    {
        public int FromWarehouseId { get; set; }

        public int ToWarehouseId { get; set; }

        public DateTime TransferDate { get; set; }

        public string? Status { get; set; }
    }
}