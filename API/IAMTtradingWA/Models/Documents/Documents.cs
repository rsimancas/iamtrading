using System;

namespace IAMTradingWA.Models
{
    public class Document
    {
        public int DocID { get; set; }
        public int? QHeaderId { get; set; }
        public int? DocTypeID { get; set; }
        public string DocDesc { get; set; }
        public string DocCreatedBy { get; set; }
        public DateTime DocCreatedDate { get; set; }
        public string DocModifiedBy { get; set; }
        public Nullable<DateTime> DocModifiedDate { get; set; }
        public int? VendorId { get; set; }
        public int? VendorQuoteId { get; set; }
        public string x_DocTypeName { get; set; }
        public int x_AttachId { get; set; }
    }
}