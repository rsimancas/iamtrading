using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface ICustomersRepository
    {
        Customer Get(int id, ref string errMsg);
        Customer Add(Customer data, ref string errMsg);
        bool Remove(Customer data, ref string errMsg);
        Customer Update(Customer data, ref string errMsg);
        IList<Customer> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
