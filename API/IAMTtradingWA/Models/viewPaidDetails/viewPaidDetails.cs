using System;

namespace IAMTradingWA.Models
{
    public class viewPaidDetail
    {
        public int DetailId { get; set; }
        public decimal DetailAmount { get; set; }
        public decimal DetailAmountNB { get; set; }
        public string InvoiceNum { get; set; }
        public decimal InvoiceAmount { get; set; }
        public decimal InvoiceAmountNB { get; set; }
        public int POVId { get; set; }
        public int QHeaderId { get; set; }
        public string QHeaderReference { get; set; }
        public int PayVendorId { get; set; }
        public string CustName { get; set; }
        public string VendorName { get; set; }
        public decimal DetailCurrencyRate { get; set; }
    }
}