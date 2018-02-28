using IAMTradingWA.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;

namespace IAMTradingWA.Controllers
{
    
    [TokenValidation]
    public class CurrencyRatesController : ApiController
    {
        static readonly ICurrencyRatesRepository repository = new CurrencyRatesRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            int orden = Convert.ToInt32(queryValues["orden"]);
            int grouped = Convert.ToInt32(queryValues["grouped"]);


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

            string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

            int totalRecords = 0;

            try
            {
                if (id == 0)
                {
                    object json;
                    string msgError = "";
                    IList<CurrRate> lista;

                    lista = repository.GetList(query, sort, page, start, limit, ref totalRecords, ref msgError);

                    if(grouped == 1)
                    {
                        lista = (from p in lista
                                 orderby p.CurrencyId
                        group p by p.CurrencyCode
                        into grp
                        select new CurrRate
                        {
                            CurrencyId = grp.Last().CurrencyId,
                            CurrencyCode = grp.Last().CurrencyCode,
                            CurrencyRate = grp.Last().CurrencyRate
                        }).ToList();
                    }

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
                    CurrRate estatus = repository.Get(id, ref msgError);

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

        public object Post(CurrRate added)
        {
            object json;
            string messageError = "";

            try
            {
                CurrRate posted = repository.Add(added, ref messageError);

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

        public object Put(CurrRate updated)
        {
            object json;

            try
            {
                string messageError = "";
                CurrRate putting = repository.Update(updated, ref messageError);

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
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                json = new
                {
                    message = ex.Message,
                    success = false
                };
            };

            return json;
        }

        public object Delete(CurrRate deleted)
        {
            string msgError = "";
            bool result = repository.Remove(deleted, ref msgError);

            object json = new
            {
                success = result,
                message = msgError
            };

            return json;
        }
    }
}