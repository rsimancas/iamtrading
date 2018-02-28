using IAMTradingWA.Clases;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IChargesDescriptionsRepository
    {
        ChargesDescription Get(int id);
        ChargesDescription Add(ChargesDescription data);
        bool Remove(ChargesDescription data);
        ChargesDescription Update(ChargesDescription data);
        IList<ChargesDescription> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        IList<ChargesDescription> GetList();
    }
}