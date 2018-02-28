using System;

namespace IAMTradingWA.Models
{
    public class PaymentVendorDetail
    {
        public int PayVendorDetailId { get; set; }
        public int PayVendorId { get; set; }
        public int PayModeID { get; set; }
        public string PayVendorDetailReference { get; set; }
        public decimal PayVendorDetailAmount { get; set; }
        public decimal PayVendorDetailAmountNB { get; set; }
        public decimal PayVendorDetailCurrencyRate { get; set; }
        public Nullable<DateTime> PayVendorDetailDate { get; set; }
        public string PayVendorDetailComments { get; set; }
        public string x_PayModeDescription { get; set; }
        public virtual string BankAccount { get; set; }
        public int? AccountID { get; set; }
    }
}