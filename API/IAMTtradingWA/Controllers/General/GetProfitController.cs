using IAMTradingWA.Models;
using System;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;

namespace IAMTradingWA.Controllers
{

    //[TokenValidation]
    public class GetProfitController : ApiController
    {
        static readonly IQuotesRepository repository = new QuotesRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int id = Convert.ToInt32(queryValues["QHeaderId"]);

            string errMsg = "";

            try
            {
                    Decimal profit = repository.GetProfit(id, ref errMsg);
                   
                    object json = new
                    {
                        total = 1,
                        data = profit,
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