using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IStatusRepository
    {
        Status Get(int id, ref string errMsg);
        Status Add(Status data, ref string errMsg);
        bool Remove(Status data, ref string errMsg);
        Status Update(Status data, ref string errMsg);
        IList<Status> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
