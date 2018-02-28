namespace IAMTradingWA.Models
{
    using System;
    public class GeneralCharge
    {
        public int GChargeId { get; set; }
        public int ChargeDescId { get; set; }
        public int QHeaderId { get; set; }
        public Nullable<decimal> GChargeFactor { get; set; }
        public Nullable<decimal> GChargeAmount { get; set; }
        public string GChargeCurrencyCode { get; set; }
        public Nullable<decimal> GChargeCurrencyRate { get; set; }
        public string GChargeCreatedBy { get; set; }
        public DateTime GChargeCreatedDate { get; set; }
        public string GChargeModifiedBy { get; set; }
        public Nullable<DateTime> GChargeModifiedDate { get; set; }
        public virtual string ChargeDescName { get; set; }
    }
}