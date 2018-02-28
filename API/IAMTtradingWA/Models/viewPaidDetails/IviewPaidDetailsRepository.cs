using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IviewPaidDetailsRepository
    {
        viewPaidDetail Get(int id, ref string errMsg);
        //View_PaidDetail Add(View_PaidDetail data, ref string errMsg);
        //bool Remove(View_PaidDetail data, ref string errMsg);
        //View_PaidDetail Update(View_PaidDetail data, ref string errMsg);
        IList<viewPaidDetail> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg, int PayVendorId);
    }
}
