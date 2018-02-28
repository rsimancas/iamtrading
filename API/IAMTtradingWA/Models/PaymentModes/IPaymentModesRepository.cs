using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IPaymentModesRepository
    {
        PaymentMode Get(int id, ref string errMsg);
        PaymentMode Add(PaymentMode data, ref string errMsg);
        bool Remove(PaymentMode data, ref string errMsg);
        PaymentMode Update(PaymentMode data, ref string errMsg);
        IList<PaymentMode> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
    }
}
