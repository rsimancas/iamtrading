using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    public class Vendor
    {
        public int VendorId { get; set; }
        public string VendorName { get; set; }
        public string VendorCreatedBy { get; set; }
        public DateTime VendorCreatedDate { get; set; }
        public string VendorModifiedBy { get; set; }
        public Nullable<DateTime> VendorModifiedDate { get; set; }
        public string VendorContact { get; set; }
        public string VendorAddress1 { get; set; }
        public string VendorAddress2 { get; set; }
        public string VendorPhone { get; set; }
        public string VendorEmail { get; set; }
        public string VendorWebsite { get; set; }
        public string VendorZip { get; set; }
        public Nullable<decimal> VendorPctCommission { get; set; }
        public Nullable<decimal> x_VendorBalance { get; set; }
        public Nullable<decimal> x_GrandTotalBalance { get; set; }

        public int BrokerId { get; set; }
        public virtual string BrokerName { get; set; }
    }

    public class PurchaseToPay
    {
        public int ID { get; set; }
        public decimal amount { get; set; }
    }

    public class Payment {
        //public List<PurchaseToPay> POList { get; set; }
        public List<PurchaseOrderVendor> POVList { get; set; }
        public List<PaymentVendorDetail> PaidDetail { get; set; }
        public List<Attached> Files { get; set; }
    }
}