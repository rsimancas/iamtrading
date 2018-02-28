using System;

namespace IAMTradingWA.Models
{
    public class Sequences
    {
        public int SeqId { get; set; }
        public string SeqName { get; set; }
        public int SeqValue { get; set; }
        public string SeqPrefix { get; set; }
        public DateTime SeqCreatedDate { get; set; }
        public string SeqCreatedBy { get; set; }
        public Nullable<DateTime> SeqModifiedDate { get; set; }
        public string SeqModifiedBy { get; set; }
    }
}