namespace IAMTradingWA.Models
{
    using System;
    public class ChargesCategory
    {
        public int CCategoryId { get; set; }
        public string CCategoryName { get; set; }
        public string CCategoryCreatedBy { get; set; }
        public DateTime CCategoryCreatedDate { get; set; }
        public string CCategoryModifiedBy { get; set; }
        public Nullable<DateTime> CCategoryModifiedDate { get; set; }
    }
}