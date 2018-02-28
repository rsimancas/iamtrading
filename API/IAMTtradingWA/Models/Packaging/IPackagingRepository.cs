using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPackagingRepository
    {
        Package Get(int id);
        Package Add(Package data);
        bool Remove(Package data);
        Package Update(Package data);
        IList<Package> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}
