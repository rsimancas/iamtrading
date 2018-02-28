using IAMTradingWA.Clases;
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
    public class QuoteHeaderController : ApiController
    {
        static readonly IQuotesRepository repository = new QuotesRepository();

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

                if (id == 0)
                {
                    object json;
                    string msgError = "";
                    IList<QuoteHeader> lista;

                    lista = repository.GetListHeader(roleId, filterDateField, filterBalance, strDateFrom, strDateTo, FilterShowWithInvoice, query, filter, sort, page, start, limit, ref totalRecords, ref msgError);

                    json = new
                    {
                        total = totalRecords,
                        data = lista,
                        success = true
                    };

                    return json;
                }
                else
                {
                    string msgError = "";
                    Models.QuoteHeader estatus = repository.GetHeader(id, ref msgError);

                    object json = new
                    {
                        data = estatus,
                        success = true,
                        message = msgError
                    };

                    return json;
                }
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

        public object Post(QuoteHeader added)
        {
            object json;
            string messageError = "";

            try
            {
                Models.QuoteHeader posted = repository.AddHeader(added, ref messageError);

                if (posted != null)
                {
                    json = new
                    {
                        total = 1,
                        data = posted,
                        success = true
                    };
                } else {
                    json = new
                    {
                        message = messageError,
                        success = false
                    };
                };
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object error = new { message = ex.Message };

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Put(QuoteHeader updated)
        {
            object json;

            try
            {
                string messageError = "";
                QuoteHeader putting = repository.UpdateHeader(updated, ref messageError);

                if (putting != null)
                {
                    json = new
                    {
                        total = 1,
                        data = putting,
                        success = true
                    };
                }
                else
                {
                    json = new
                    {
                        message = messageError,
                        success = false
                    };
                }
            }
            catch (Exception ex)
            {
                ex = ExceptionExtensions.GetOriginalException(ex);

                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Delete(QuoteHeader deleted)
        {
            string msgError = "";
            bool result = repository.RemoveHeader(deleted, ref msgError);

            object json = new
            {
                success = result,
                message = msgError
            };

            return json;
        }
    }
}