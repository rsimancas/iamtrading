namespace IAMTradingWA.Models
{
    using System;
    public class ChargesDescription
    {
        public int ChargeDescId { get; set; }
        public string ChargeDescName { get; set; }
        public Nullable<Decimal> ChargeDefaultFactor { get; set; }
        public int CCategoryId { get; set; }
        public string ChargeDescCreatedBy { get; set; }
        public DateTime ChargeDescCreatedDate { get; set; }
        public string ChargeDescModifiedBy { get; set; }
        public Nullable<DateTime> ChargeDescModifiedDate { get; set; }
        public virtual string CCategoryName { get; set; }
    }
}