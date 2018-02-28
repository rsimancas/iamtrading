using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPurchaseOrdersVendorsRepository
    {
        #region Purchase Orders Vendors
        PurchaseOrderVendor Get(int id, User currentUser, ref string errMsg);
        PurchaseOrderVendor Add(PurchaseOrderVendor data, User currentUser, ref string errMsg);
        bool Remove(PurchaseOrderVendor data, ref string errMsg);
        PurchaseOrderVendor Update(IDictionary<String, object> data, User CurrentUser,ref string errMsg);
        IList<PurchaseOrderVendor> GetList(User currentUser, int VendorId, int QHeaderId, int parentPOrderId, bool showOnlyCerradas, bool showOnlySelected, bool showOnlyWithBalance, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        #endregion Purchase Orders Vendores

        #region Purchase Orders Vendors Details
        POVendorsDetail GetDetail(int id, ref string errMsg);
        POVendorsDetail AddDetail(POVendorsDetail data, ref string errMsg);
        bool RemoveDetail(POVendorsDetail data, ref string errMsg);
        POVendorsDetail UpdateDetail(POVendorsDetail data, ref string errMsg);
        IList<POVendorsDetail> GetListDetails(int POVId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        #endregion Purchase Orders Vendors Details
    }
}
