using System;

namespace IAMTradingWA.Models
{
    public class CurrRate
    {
        public int CurrencyId { get; set; }
        public string CurrencyCode { get; set; }
        public decimal CurrencyRate { get; set; }
        public DateTime CurrencyDate { get; set; }
    }
}