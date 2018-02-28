namespace IAMTradingWA.Models
{
    using System;

    public class VendorQuote
    {
        public int VendorQuoteId { get; set; }
        public int VendorId { get; set; }
        public DateTime VendorQuoteDate { get; set; }
        public string VendorQuoteReference { get; set; }
        public int CurrencyId { get; set; }
        public string VendorQuoteFolio { get; set; }
        public virtual string VendorName { get; set; }
        public virtual string CurrencyCode { get; set; }
        public virtual string CountryName { get; set; }
    }
}