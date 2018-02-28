using System;

namespace IAMTradingWA.Models
{
    public class QuoteHeader
    {
        public int QHeaderId { get; set; }
        public int? StatusId { get; set; }
        public Nullable<DateTime> QHeaderDate { get; set; }
        public string QHeaderReference { get; set; }
        public string QHeaderOC { get; set; } // Numero de Orden de Compra
        public Nullable<DateTime> QHeaderOCDate { get; set; } // Fecha de Orden de Compra
        public string QHeaderStatusInfo { get; set; }
        public Nullable<DateTime> QHeaderEstimatedDate { get; set; } // Fecha Estimada
        public string QHeaderCreatedBy { get; set; }
        public DateTime QHeaderCreatedDate { get; set; }
        public string QHeaderModifiedBy { get; set; }
        public string QHeaderComments { get; set; }
        public Nullable<DateTime> QHeaderModifiedDate { get; set; }
        public Nullable<decimal> QHeaderTotal { get; set; }
        public string x_StatusName { get; set; }
        public Nullable<decimal> x_TotalInQuotes { get; set; }
        public Nullable<decimal> x_TotalBSInQuotes { get; set; }

        // Campos añadidos el 12/05/2015
        public Nullable<decimal> QHeaderCurrencyRate { get; set; }
        public Nullable<decimal> QHeaderVolumeWeight { get; set; }
        public Nullable<decimal> QHeaderCubicFeet { get; set; }
        public Nullable<decimal> QHeaderCost { get; set; }
        public Nullable<decimal> x_CostInQuotes { get; set; }

        // 14/05/2015
        public int? BrokerId { get; set; }
        public string x_BrokerName { get; set; }
        public string x_VendorName { get; set; }
        public Nullable<decimal> x_Profit { get; set; }
        public Nullable<decimal> x_ProfitPct { get; set; }
        public Nullable<decimal> x_ProfitInQuotes { get; set; }

        //23/05/2015
        public int? CustId { get; set; }
        public string x_CustName { get; set; }

        // 25/05/2015
        public Nullable<decimal> x_VolumeWeightInQuotes { get; set; }
        public Nullable<decimal> x_CubicFeetInQuotes { get; set; }

        // 28/05/2015
        public Nullable<decimal> x_ExchangeVariation { get; set; }
        public Nullable<decimal> x_ExchangeVariationInQuotes { get; set; }

        // 03/06/2015
        public Nullable<DateTime> x_DateOrderReceived { get; set; }
        public Nullable<decimal> x_PORate { get; set; }
        public Nullable<decimal> x_PBRate { get; set; }
        public int? x_DateApproved { get; set; }
        public int? x_DaysAvg { get; set; }
        public Nullable<decimal> x_DolarIAM { get; set; }

        // 11/06/2015
        public string QHeaderGYComments { get; set; }

        // 12/06/2015
        public Nullable<decimal> x_ExchVarHistory { get; set; }
        public Nullable<decimal> x_TotalPorAprobacion { get; set; }
        public int? x_CountPorAprobacion { get; set; }

        // 15/06/2015
        public Nullable<decimal> x_Cost { get; set; }
        public Nullable<decimal> x_Total { get; set; }
        public Nullable<decimal> x_TotalBS { get; set; }
        public string QHeaderPOComments { get; set; }
        public string QHeaderCostComments { get; set; }
        public int? VendorId { get; set; }

        // 16/06/2015
        public Nullable<decimal> x_InternalCharges { get; set; }
        public Nullable<decimal> x_ICInQuotes { get; set; }

        // 18/06/2015
        public string QHeaderNumFianza { get; set; }

        // 25/06/2015
        public Nullable<decimal> x_InvoiceBalance { get; set; }
        public Nullable<decimal> x_GrandInvoiceBalance { get; set; }

        // 26/07/2015
        public Nullable<DateTime> x_PaidDate { get; set; }

        // 01/09/2015
        public Nullable<decimal> x_Paid { get; set; }
        // 15/09/2015
        public Nullable<decimal> x_GrandPaid { get; set; }

        //15/10/2015
        public string x_Condition { get; set; }

        //16/10/2015
        public virtual string HasInvoice { get; set; }

        // 19/10/2015
        public virtual Nullable<DateTime> InvoiceDate { get; set; }

        // 20/10/2015
        public virtual Nullable<decimal> POBalance { get; set; }
        public virtual Nullable<decimal> x_GrandPOBalance { get; set; }

        // 13/11/2015
        public virtual Nullable<decimal> Paid1 { get; set; }
        public virtual Nullable<decimal> PaidNB1 { get; set; }
        public virtual Nullable<decimal> PaidRate1 { get; set; }
        public virtual Nullable<DateTime> PaidDate1 { get; set; }
        public virtual Nullable<decimal> Paid2 { get; set; }
        public virtual Nullable<decimal> PaidNB2 { get; set; }
        public virtual Nullable<decimal> PaidRate2 { get; set; }
        public virtual Nullable<DateTime> PaidDate2 { get; set; }
        public virtual Nullable<decimal> Paid3 { get; set; }
        public virtual Nullable<decimal> PaidNB3 { get; set; }
        public virtual Nullable<decimal> PaidRate3 { get; set; }
        public virtual Nullable<DateTime> PaidDate3 { get; set; }
        public virtual Nullable<decimal> Paid4 { get; set; }
        public virtual Nullable<decimal> PaidNB4 { get; set; }
        public virtual Nullable<decimal> PaidRate4 { get; set; }
        public virtual Nullable<DateTime> PaidDate4 { get; set; }
        public virtual Nullable<decimal> QuoteRate { get; set; }
        public virtual Nullable<decimal> CurRate { get; set; }

        // 2017/04/06
        public bool QHeaderCurrencyNA { get; set; }


    }

    public class QuoteDetail
    {
        public int QDetailId { get; set; }
        public int QHeaderId { get; set; }
        public int ItemId { get; set; }
        public int VendorId { get; set; }
        public decimal QDetailQty { get; set; }
        public decimal QDetailPrice { get; set; }
        public decimal QDetailLineTotal { get; set; }
        public string x_ItemName { get; set; }
        public string x_VendorName { get; set; }
        public string x_ItemGYCode { get; set; }

        public Nullable<DateTime> x_QHeaderDate { get; set; }
        public string x_QHeaderReference { get; set; }
        public string x_QHeaderOC { get; set; }
        public Nullable<DateTime> x_QHeaderOCDate  { get; set; }
        public string x_QHeaderStatusInfo { get; set; }
        public Nullable<DateTime> x_QHeaderEstimatedDate  { get; set; }
        public string x_StatusName { get; set; }
        public string x_QHeaderComments { get; set; }

        // Campos Añadidos el 12/05/2015
        public Nullable<decimal> QDetailCost { get; set; }
        public Nullable<decimal> QDetailLineCost { get; set; }
    }
}