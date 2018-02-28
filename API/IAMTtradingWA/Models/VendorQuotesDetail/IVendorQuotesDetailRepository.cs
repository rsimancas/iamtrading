using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IVendorQuotesDetailRepository
    {
        VendorQuoteDetail Get(int id, ref string errMsg);
        VendorQuoteDetail Add(VendorQuoteDetail data, ref string errMsg);
        bool Remove(VendorQuoteDetail data, ref string errMsg);
        VendorQuoteDetail Update(VendorQuoteDetail data, ref string errMsg);
        IList<VendorQuoteDetail> GetList(int VendorQuoteId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
