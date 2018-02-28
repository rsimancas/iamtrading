using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IBankAccountsRepository
    {
        Account Get(int id, ref string errMsg);
        Account Add(Account data, ref string errMsg);
        bool Remove(Account data, ref string errMsg);
        Account Update(Account data, ref string errMsg);
        IList<Account> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
