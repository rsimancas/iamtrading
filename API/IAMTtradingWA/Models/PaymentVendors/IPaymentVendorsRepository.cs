using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPaymentVendorsRepository
    {
        PaymentVendor Get(int id, ref string errMsg);
        PaymentVendor Add(PaymentVendor data, ref string errMsg);
        bool Remove(PaymentVendor data, ref string errMsg);
        PaymentVendor Update(PaymentVendor data, ref string errMsg);
        IList<PaymentVendor> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
