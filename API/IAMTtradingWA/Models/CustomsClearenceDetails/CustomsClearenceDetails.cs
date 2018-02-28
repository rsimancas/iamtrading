namespace IAMTradingWA.Models
{
    using System;
    public class CustomsClearenceDetail
    {
        public int CCDetailId { get; set; }
        public int CClearenceId { get; set; }
        public int QDetailId { get; set; }
        public Nullable<decimal> CCDetailWeighFactor { get; set; }
        public Nullable<decimal> CCDetailFleteCCS { get; set; }
        public Nullable<decimal> CCDetailFleteMIA { get; set; }
        public Nullable<decimal> CCDetailOtherExpenses { get; set; }
        public Nullable<decimal> CCDetailAmountIDB { get; set; }
        public Nullable<decimal> CCDetailTariffPct { get; set; }
        public Nullable<decimal> CCDetailTariffAmount { get; set; }
        public Nullable<decimal> CCDetailTaxPct { get; set; }
        public Nullable<decimal> CCDetailTaxAmount { get; set; }
        public Nullable<decimal> CCDetailCustomsSrvPct { get; set; }
        public Nullable<decimal> CCDetailCustomsSrvAmount { get; set; }
        public Nullable<decimal> CCDetailGuarantee { get; set; }
        public Nullable<decimal> CCDetailProfitMargin { get; set; }
        public Nullable<decimal> CCDetailProfitAmount { get; set; }
        public Nullable<decimal> CCDetailCurrencyRate { get; set; }
        public Nullable<decimal> CCDetailLinePrice { get; set; }
        public virtual decimal QDetailQty { get; set; }
        public virtual decimal QDetailPrice { get; set; }
        public virtual decimal QDetailLineTotal { get; set; }
        public virtual Nullable<decimal> QDetailCost { get; set; }
        public virtual Nullable<decimal> QDetailLineCost { get; set; }
        public virtual int QHeaderId { get; set; }
        public virtual string ItemName { get; set; }
        public virtual string ItemNum { get; set; }
        public virtual string ItemGYCode { get; set; }
        public virtual Nullable<decimal> ItemTariffPct { get; set; }
        public virtual string ItemTariffCode { get; set; }
        public virtual Nullable<decimal> ItemLength { get; set; }
        public virtual Nullable<decimal> ItemHeight { get; set; }
        public virtual Nullable<decimal> ItemWidth { get; set; }
        public virtual Nullable<decimal> ItemVolume { get; set; }
        public virtual Nullable<decimal> ItemWeight { get; set; }
        public virtual string ItemNameSupplier { get; set; }
        public virtual string ItemNumSupplier { get; set; }
    }
}