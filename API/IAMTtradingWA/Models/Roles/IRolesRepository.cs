using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IRolesRepository
    {
        Roles Get(int id, ref string errMsg);
        Roles Add(Roles data, ref string errMsg);
        bool Remove(Roles data, ref string errMsg);
        Roles Update(Roles data, ref string errMsg);
        IList<Roles> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}