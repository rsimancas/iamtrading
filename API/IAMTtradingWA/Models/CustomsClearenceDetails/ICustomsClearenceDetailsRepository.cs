using IAMTradingWA.Clases;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface ICustomsClearenceDetailsRepository
    {
        CustomsClearenceDetail Get(int id);
        CustomsClearenceDetail Add(CustomsClearenceDetail data);
        bool Remove(CustomsClearenceDetail data);
        CustomsClearenceDetail Update(CustomsClearenceDetail data);
        IList<CustomsClearenceDetail> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}