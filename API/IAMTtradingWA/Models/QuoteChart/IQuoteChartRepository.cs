using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IQuoteChartRepository
    {
        IList<QuoteChart> GetData(int roleId, string filterDateField, Decimal filterBalance, string strDateFrom, string strDateTo, string FilterShowWithInvoice, string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
