using IAMTradingWA.Clases;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface ICustomsClearenceRepository
    {
        CustomsClearence Get(int id);
        CustomsClearence Add(CustomsClearence data);
        bool Remove(CustomsClearence data);
        CustomsClearence Update(CustomsClearence data);
        IList<CustomsClearence> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        CustomsClearence GetByQuote(int quoteId, int mode = 0);
    }
}