using System;
using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IVendorsRepository
    {
        Vendor Get(int id, ref string errMsg);
        Vendor Add(Vendor data, ref string errMsg);
        bool Remove(int id, ref string errMsg);
        Vendor Update(IDictionary<String, object> data, ref string errMsg);
        IList<Vendor> GetList(bool onlyWithBalnce, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);

        void CleanUserVendorSelections(int VendorId, string UserId);

        bool Pay(int VendorId, string UserId, Payment Paid, ref string msg);

        bool ReversePaid(int PayVendorId, string UserId, ref string msg);
    }
}
