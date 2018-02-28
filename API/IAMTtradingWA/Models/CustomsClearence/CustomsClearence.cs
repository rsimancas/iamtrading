namespace IAMTradingWA.Models
{
    using System;
    public class CustomsClearence
    {
        public int CClearenceId { get; set; }
        public int CClearenceMode { get; set; }
        public int QHeaderId { get; set; }
        public DateTime CClearenceDate { get; set; }
        public Nullable<decimal> CClearenceCurrencyRate { get; set; }
        public string CClearenceCurrencyCode { get; set; }
        public Nullable<decimal> CClearenceFactor { get; set; }
        public string CClearenceCreatedBy { get; set; }
        public DateTime CClearenceCreatedDate { get; set; }
        public string CClearenceModifiedBy { get; set; }
        public Nullable<DateTime> CClearenceModifiedDate { get; set; }
        public virtual Nullable<DateTime> QHeaderDate { get; set; }
        public virtual string QHeaderReference { get; set; }
        public virtual string QHeaderOC { get; set; }
        public virtual string QHeaderStatusInfo { get; set; }
        public virtual string QHeaderNumFianza { get; set; }
        public virtual string BrokerName { get; set; }
        public virtual string CustName { get; set; }
        public virtual string VendorName { get; set; }
        public virtual string StatusName { get; set; }

        //public virtual string BrokerName { get; set; }
        //public virtual string CustName { get; set; }
        //public virtual string VendorName { get; set; }
        //public virtual int? StatusId { get; set; }
        //public virtual Nullable<DateTime> QHeaderDate { get; set; }
        //public virtual string QHeaderReference { get; set; }
        //public virtual string QHeaderOC { get; set; }
        //public virtual string QHeaderStatusInfo { get; set; }
        //public virtual string QHeaderNumFianza { get; set; }
    }
}