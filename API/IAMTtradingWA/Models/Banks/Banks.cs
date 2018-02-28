using System;

namespace IAMTradingWA.Models
{
    public class Bank
    {
        public int BankID { get; set; }
        public string BankName { get; set; }
        public string BankCreatedBy { get; set; }
        public DateTime BankCreated { get; set; }
        public string BankModifiedBy { get; set; }
        public Nullable<DateTime> BankModified { get; set; }
    }
}