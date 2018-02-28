using IAMTradingWA.Clases;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IChargesCategoriesRepository
    {
        ChargesCategory Get(int id);
        ChargesCategory Add(ChargesCategory data);
        bool Remove(ChargesCategory data);
        ChargesCategory Update(ChargesCategory data);
        IList<ChargesCategory> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
    }
}