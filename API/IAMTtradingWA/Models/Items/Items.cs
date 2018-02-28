using System;

namespace IAMTradingWA.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public int VendorId { get; set; }
        public string ItemName { get; set; }
        public string ItemNameSupplier { get; set; }
        public string ItemNum { get; set; }
        public string ItemNumSupplier { get; set; }
        public decimal ItemPrice { get; set; }
        public string ItemCreatedBy { get; set; }
        public DateTime ItemCreatedDate { get; set; }
        public string ItemModifiedBy { get; set; }
        public Nullable<DateTime> ItemModifiedDate { get; set; }
        public string ItemGYCode { get; set; }
        public string x_VendorName { get; set; }

        // Añadido el 12/05/2015
        public Nullable<decimal> ItemCost { get; set; }

        // 30/09/2015
        public Nullable<decimal> ItemWeight { get; set; }
        public Nullable<decimal> ItemVolume { get; set; }
        public Nullable<decimal> ItemWidth { get; set; }
        public Nullable<decimal> ItemHeight { get; set; }
        public Nullable<decimal> ItemLength { get; set; }
        public Nullable<decimal> ItemTariffPct { get; set; }
        public string ItemTariffCode { get; set; }

        // 04/10/2016
        public string ItemNalcoCode { get; set; }
        public int? CustId { get; set; }
        public int? PackId { get; set; }
        public int? ItemNalcoType { get; set; }
    }
}