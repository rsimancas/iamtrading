using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IImagesRepository
    {
        Img Get(int id, ref string errMsg);
        Img Add(Img data, ref string errMsg);
        bool Remove(Img data, ref string errMsg);
        Img Update(IDictionary<String, object> data, User currentUser, ref string errMsg);
        IList<Img> GetList(int itemId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
