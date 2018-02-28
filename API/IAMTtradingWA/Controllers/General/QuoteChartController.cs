using IAMTradingWA.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;

namespace IAMTradingWA.Controllers
{

    [TokenValidation]
    public class QuoteChartController : ApiController
    {
        static readonly IQuoteChartRepository repository = new QuoteChartRepository();

        public object GetAll()
        {
            try
            {
                var queryValues = Request.RequestUri.ParseQueryString();

                int page = Convert.ToInt32(queryValues["page"]);
                int start = Convert.ToInt32(queryValues["start"]);
                int limit = Convert.ToInt32(queryValues["limit"]);
                int id = Convert.ToInt32(queryValues["id"]);
                int orden = Convert.ToInt32(queryValues["orden"]);

                string filterDateField = queryValues["FilterDateField"];
                string strDateFrom = queryValues["DateFrom"];
                string strDateTo = queryValues["DateTo"];
                int roleId = Convert.ToInt32(queryValues["Role"]);

                string strFilterBalance = queryValues["FilterBalance"];
                Decimal filterBalance = String.IsNullOrEmpty(strFilterBalance) ? 0 : Convert.ToDecimal(strFilterBalance);

                string FilterShowWithInvoice = queryValues["FilterShowWithInvoice"];

                FilterShowWithInvoice = !String.IsNullOrEmpty(FilterShowWithInvoice) ? FilterShowWithInvoice : "All";



                #region Configuramos el orden de la consulta si se obtuvo como parametro
                string strOrder = !string.IsNullOrWhiteSpace(queryValues["sort"]) ? queryValues["sort"] : "";
                strOrder = strOrder.Replace('[', ' ');
                strOrder = strOrder.Replace(']', ' ');

                Sort sort;

                if (!string.IsNullOrWhiteSpace(strOrder))
                {
                    sort = JsonConvert.DeserializeObject<Sort>(strOrder);
                }
                else
                {
                    sort = new Sort();
                }
                #endregion

                #region Configuramos el filtro de la consulta si se obtuvo como parametro
                string strFilter = !string.IsNullOrWhiteSpace(queryValues["filter"]) ? queryValues["filter"] : "";
                strFilter = strFilter.Replace('[', ' ');
                strFilter = strFilter.Replace(']', ' ');

                Filter filter;

                if (!string.IsNullOrWhiteSpace(strFilter))
                {
                    filter = JsonConvert.DeserializeObject<Filter>(strFilter);
                }
                else
                {
                    filter = new Filter();
                }
                #endregion Configuramos el filtro de la consulta si se obtuvo como parametro

                string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

                int totalRecords = 0;

                object json;
                string msgError = "";
                IList<QuoteChart> lista;

                lista = repository.GetData(roleId, filterDateField, filterBalance, strDateFrom, strDateTo, FilterShowWithInvoice, query, filter, sort, page, start, limit, ref totalRecords, ref msgError);

                json = new
                {
                    total = totalRecords,
                    data = lista,
                    success = true
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