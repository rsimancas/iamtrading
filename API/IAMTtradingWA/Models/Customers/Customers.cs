using System;

namespace IAMTradingWA.Models
{
    public class Customer
    {
        public int CustId { get; set; }
        public string CustName { get; set; }
        public string CustCreatedBy { get; set; }
        public DateTime CustCreated { get; set; }
        public string CustModifiedBy { get; set; }
        public Nullable<DateTime> CustModified { get; set; }
        public Nullable<Decimal> CustPctPP { get; set; }
    }
}