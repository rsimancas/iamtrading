using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface ISequencesRepository
    {
        Sequences Get(int id, ref string errMsg);
        Sequences Add(Sequences data, ref string errMsg);
        bool Remove(Sequences data, ref string errMsg);
        Sequences Update(Sequences data, ref string errMsg);
        IList<Sequences> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
