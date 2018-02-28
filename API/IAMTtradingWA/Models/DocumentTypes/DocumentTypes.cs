using System;

namespace IAMTradingWA.Models
{
    public class DocumentType
    {
        public int DocTypeID { get; set; }
        public string DocTypeName { get; set; }
        public string DocTypeCreatedBy { get; set; }
        public DateTime DocTypeCreatedDate { get; set; }
        public string DocTypeModifiedBy { get; set; }
        public Nullable<DateTime> DocTypeModifiedDate { get; set; }
    }
}