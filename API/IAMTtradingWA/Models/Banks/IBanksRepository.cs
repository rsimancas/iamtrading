using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IBanksRepository
    {
        Bank Get(int id, ref string errMsg);
        Bank Add(Bank data, ref string errMsg);
        bool Remove(Bank data, ref string errMsg);
        Bank Update(Bank data, ref string errMsg);
        IList<Bank> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
