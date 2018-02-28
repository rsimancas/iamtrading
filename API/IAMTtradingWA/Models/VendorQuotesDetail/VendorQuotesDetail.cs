namespace IAMTradingWA.Models
{
    using System;

    public class VendorQuoteDetail
    {
        public int VQDetailId { get; set; }
        public int VendorQuoteId { get; set; }
        public int ItemId { get; set; }
        public decimal VQDetailCost { get; set; }
        public int VQDetailLineNumber { get; set; }
        public virtual string ItemName { get; set; }
        public virtual string ItemNameSupplier { get; set; }
        public virtual string ItemGYCode { get; set; }
        public virtual string ItemNum { get; set; }
        public virtual string ItemNumSupplier { get; set; }
    }
}