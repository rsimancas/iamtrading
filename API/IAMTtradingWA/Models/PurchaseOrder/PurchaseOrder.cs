using System;

namespace IAMTradingWA.Models
{
    public class PurchaseOrder
    {
        public int POrderId { get; set; }
        public int QHeaderId { get; set; }
        public string POrderType { get; set; }
        public decimal POrderAmount { get; set; }
        public decimal POrderAmountNB { get; set; }
        public DateTime POrderDate { get; set; }
        public decimal POrderCurrencyRate { get; set; }
        public int? POrderParentId { get; set; }
        public string POrderPaymentNumber { get; set; }
        public string POrderCreatedBy { get; set; }
        public DateTime POrderCreatedDate { get; set; }
        public string POrderModifiedBy { get; set; }
        public Nullable<DateTime> POrderModifiedDate { get; set; }
        public Nullable<bool> POrderManagerChecked { get; set; }
        public Nullable<decimal> POrderPctPP { get; set; }
    }

}