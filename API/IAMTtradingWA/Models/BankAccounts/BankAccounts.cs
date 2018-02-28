using System;

namespace IAMTradingWA.Models
{
    public class Account
    {
        public int AccountID { get; set; }
        public string AccountNumber { get; set; }
        public string AccountReference { get; set; }
        public int BankID { get; set; }
        public string AccountCreatedBy { get; set; }
        public DateTime AccountCreated { get; set; }
        public string AccountModifiedBy { get; set; }
        public Nullable<DateTime> AccountModified { get; set; }
        public virtual string BankName { get; set; }
        public virtual string BankAccount { get; set; }
    }
}