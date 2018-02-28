using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IDocumentTypesRepository
    {
        DocumentType Get(int id, ref string errMsg);
        DocumentType Add(DocumentType data, ref string errMsg);
        bool Remove(DocumentType data, ref string errMsg);
        DocumentType Update(DocumentType data, ref string errMsg);
        IList<DocumentType> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
