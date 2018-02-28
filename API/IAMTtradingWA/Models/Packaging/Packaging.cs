using System;

namespace IAMTradingWA.Models
{
    public class Package
    {
        public int PackId { get; set; }
        public string PackName { get; set; }
        public string PackCreatedBy { get; set; }
        public DateTime PackCreatedDate { get; set; }
        public string PackModifiedBy { get; set; }
        public Nullable<DateTime> PackModifiedDate { get; set; }
    }
}