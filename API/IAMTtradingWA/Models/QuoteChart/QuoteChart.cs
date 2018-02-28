using System;

namespace IAMTradingWA.Models
{
    public class QuoteChart
    {
        public int Year { get; set; }
        public string Month { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> GY { get; set; }
        public Nullable<decimal> CC { get; set; }
        public Nullable<decimal> INV { get; set; }
        public Nullable<decimal> VolumeWeight { get; set; }
    }
}