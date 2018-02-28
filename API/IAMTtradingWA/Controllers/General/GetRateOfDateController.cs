using IAMTradingWA.Models;
using System;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;

namespace IAMTradingWA.Controllers
{

    //[TokenValidation]
    public class GetRateOfDateController : ApiController
    {
        static readonly ICurrencyRatesRepository repository = new CurrencyRatesRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            DateTime dateTo = Convert.ToDateTime(queryValues["dateTo"]);

            string errMsg = "";

            try
            {
                    Decimal rateOfDate = repository.GetRateOfDate(dateTo, ref errMsg);
                   
                    object json = new
                    {
                        total = 1,
                        data = rateOfDate,
                        success = true,
                        message = errMsg
                    };

                    return json;
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object error = new { message = ex.Message };

                object json = new
                {
                    message = ex.Message,
                    success = false
                };

                return json;
            }
        }
    }
}