using System;

namespace IAMTradingWA.Models
{
    public class Status
    {
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public int StatusOrder { get; set; }
        public string StatusCreatedBy { get; set; }
        public DateTime StatusCreatedDate { get; set; }
        public string StatusModifiedBy { get; set; }
        public Nullable<DateTime> StatusModifiedDate { get; set; }
    }
}