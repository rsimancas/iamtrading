using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IAttachmentsRepository
    {
        IList<Attached> GetList(bool dirty, string currentUser, ref int totalRecords, ref string errMsg, int PayVendorId);

        Attached Update(IDictionary<String, object> data, string currentUser, ref string errMsg);

        bool Remove(Attached data, ref string errMsg);

        bool InsertAttachedDocument(string tempFile, int docTypeID, string currentUser, int vendorQuoteId, int vendorId, int qheaderId, string docname, string contenttype, ref string errMsg);

        bool InsertAttachedImage(string tempFile, string currentUser, int itemId, string imgName, string contenttype, ref string errMsg);

        bool InsertAttach(string tempFile, string currentUser, bool dirty, string fileName, string contenttype, ref string errMsg);

        byte[] GetFileData(int movId, ref string contentType, ref string filename, ref string errMsg, bool thumbnail = false);

        string GetFile(int attachId, ref string contentType, ref string errMsg);

        string GetThumbFile(int id, ref string contenttype, ref string errMsg);
    }
}
