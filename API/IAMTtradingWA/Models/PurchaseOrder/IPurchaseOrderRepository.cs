using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPurchaseOrderRepository
    {
        PurchaseOrder Get(int id, ref string errMsg);
        PurchaseOrder Add(PurchaseOrder data, ref string errMsg);
        bool Remove(PurchaseOrder data, ref string errMsg);
        PurchaseOrder Update(PurchaseOrder data, ref string errMsg);
        IList<PurchaseOrder> GetList(int QHeaderId, int parentPOrderId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
