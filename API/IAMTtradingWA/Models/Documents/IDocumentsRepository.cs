using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IDocumentsRepository
    {
        Document Get(int id, ref string errMsg);
        Document Add(Document data, ref string errMsg);
        bool Remove(Document data, ref string errMsg);
        Document Update(IDictionary<String, object> data, User currentUser, ref string errMsg);
        IList<Document> GetList(int vendorQuoteId, int vendorId, int qHeaderId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
