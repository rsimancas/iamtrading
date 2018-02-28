using IAMTradingWA.Clases;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IGeneralChargesRepository
    {
        GeneralCharge Get(int id);
        GeneralCharge Add(GeneralCharge data);
        bool Remove(GeneralCharge data);
        GeneralCharge Update(GeneralCharge data);
        IList<GeneralCharge> GetList(FieldFilters fieldFilters, string query, Sort sort, int page, int start, int limit, ref int totalRecords);
        IList<GeneralCharge> GetListByQuote(int QHeaderId);
    }
}