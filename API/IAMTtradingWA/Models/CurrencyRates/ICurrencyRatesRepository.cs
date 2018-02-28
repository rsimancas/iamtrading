using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface ICurrencyRatesRepository
    {
        CurrRate Get(int id, ref string errMsg);
        CurrRate Add(CurrRate data, ref string errMsg);
        bool Remove(CurrRate data, ref string errMsg);
        CurrRate Update(CurrRate data, ref string errMsg);
        IList<CurrRate> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        Decimal GetRateOfDate(DateTime dateTo, ref string errMsg);

        CurrRate GetLastRegisteredRate();
    }
}
