using System;

namespace IAMTradingWA.Models
{
    public class PurchaseOrderVendor
    {
        public int POVId { get; set; }
        public int QHeaderId { get; set; }
        public int VendorId { get; set; }
        public string POVType { get; set; }
        public decimal POVAmount { get; set; }
        public decimal POVAmountNB { get; set; }
        public DateTime POVDate { get; set; }
        public decimal POVCurrencyRate { get; set; }
        public int? POVParentId { get; set; }
        public string POVPaymentNumber { get; set; }
        public string POVCreatedBy { get; set; }
        public DateTime POVCreatedDate { get; set; }
        public string POVModifiedBy { get; set; }
        public Nullable<DateTime> POVModifiedDate { get; set; }
        public string x_VendorName { get; set; }
        public string x_QHeaderReference { get; set; }
        public Nullable<decimal> x_InvoiceVendorBalance { get; set; }
        public Nullable<decimal> x_InvoiceVendorBalanceNB { get; set; }
        public Nullable<decimal> x_TotalBalance { get; set; }
        public bool x_Selected { get; set; }
        public int CCategoryId { get; set; }
    }

    public class POVendorsDetail
    {
        public int POVDetailId { get; set; }
        public int POVId { get; set; }
        public decimal POVDetailAmount { get; set; }
        public decimal POVDetailAmountNB { get; set; }
        public decimal POVDetailCurrencyRate { get; set; }
        public string POVDetailPaymentNumber { get; set; }
        public string POVDetailType { get; set; }
        public string POVDetailCreatedBy { get; set; }
        public DateTime POVDetailCreatedDate { get; set; }
        public string POVDetailModifiedBy { get; set; }
        public Nullable<DateTime> POVDetailModifiedDate { get; set; }
        public DateTime POVDetailDate { get; set; }
        public int PayVendorId { get; set; }
    }
}