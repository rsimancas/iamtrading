using System;

namespace IAMTradingWA.Models
{
    public class Uploads
    {
        public int TabId { get; set; }
        public int CiudadId { get; set; }
        public decimal TabTarifa { get; set; }
        public string x_Ciudad { get; set; }
    }

    public class Attached {
        public int AttachId { get; set; }
        public string AttachName { get; set; }
        public string AttachContentType { get; set; }
        public string AttachFilePath { get; set; }
        //public Nullable<varbinary> AttachData { get; set; }
        public int? QHeaderId { get; set; }
        public int? ItemId { get; set; }
        public int? DocID { get; set; }
        public int? VendorId { get; set; }
        //public int? VendorQuoteId { get; set; }
        public Nullable<bool> AttachDirty { get; set; }
        public DateTime AttachCreated { get; set; }
        public string AttachCreatedBy { get; set; }
        public int? PayVendorId { get; set; }
    }
}