using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IVendorQuotesRepository
    {
        VendorQuote Get(int id, ref string errMsg);
        VendorQuote Add(VendorQuote data, ref string errMsg);
        bool Remove(VendorQuote data, ref string errMsg);
        VendorQuote Update(VendorQuote data, ref string errMsg);
        IList<VendorQuote> GetList(int VendorQuoteId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
