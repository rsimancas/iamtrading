using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPaymentVendorDetailsRepository
    {
        PaymentVendorDetail Get(int id, ref string errMsg);
        PaymentVendorDetail Add(PaymentVendorDetail data, ref string errMsg);
        bool Remove(PaymentVendorDetail data, ref string errMsg);
        PaymentVendorDetail Update(PaymentVendorDetail data, ref string errMsg);
        IList<PaymentVendorDetail> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg, int PayVendorId);
    }
}
