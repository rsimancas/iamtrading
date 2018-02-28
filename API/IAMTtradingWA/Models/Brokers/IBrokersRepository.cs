using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IBrokersRepository
    {
        Broker Get(int id, ref string errMsg);
        Broker Add(Broker data, ref string errMsg);
        bool Remove(Broker data, ref string errMsg);
        Broker Update(Broker data, ref string errMsg);
        IList<Broker> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
