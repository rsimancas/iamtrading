using System;

namespace IAMTradingWA.Models
{
    public class Broker
    {
        public int BrokerId { get; set; }
        public string BrokerName { get; set; }
        public DateTime BrokerCreated { get; set; }
        public string BrokerCreatedBy { get; set; }
        public Nullable<DateTime> BrokerModified { get; set; }
        public Nullable<DateTime> BrokerModifiedBy { get; set; }
        public Nullable<decimal> BrokerRoyaltyPct { get; set; }
    }
}