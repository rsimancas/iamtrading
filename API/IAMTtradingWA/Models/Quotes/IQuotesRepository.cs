using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IQuotesRepository
    {
        QuoteHeader GetHeader(int id, ref string errMsg);
        QuoteHeader AddHeader(QuoteHeader data, ref string errMsg);
        bool RemoveHeader(QuoteHeader data, ref string errMsg);
        QuoteHeader UpdateHeader(QuoteHeader data, ref string errMsg);
        IList<QuoteHeader> GetListHeader(int roleId, string filterDateField, Decimal filterBalance, string strDateFrom, string strDateTo, string FilterShowWithInvoice, string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        QuoteDetail GetDetail(int id, ref string errMsg);
        QuoteDetail AddDetail(QuoteDetail data, ref string errMsg);
        bool RemoveDetail(QuoteDetail data, ref string errMsg);
        QuoteDetail UpdateDetail(QuoteDetail data, ref string errMsg);
        IList<QuoteDetail> GetListDetail(int qHeaderId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        Decimal GetProfit(int qHeaderId, ref string errMsg);
    }
}
