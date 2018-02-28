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
    public class CustomsClearenceDetailsController : ApiController
    {
        static readonly ICustomsClearenceDetailsRepository repository = new CustomsClearenceDetailsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            int orden = Convert.ToInt32(queryValues["orden"]);

            string strFieldFilters = queryValues["fieldFilters"];

            FieldFilters fieldFilters = new FieldFilters();

            if (!String.IsNullOrEmpty(strFieldFilters))
            {
                fieldFilters = JsonConvert.DeserializeObject<FieldFilters>(strFieldFilters);
            }


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
                    IList<CustomsClearenceDetail> lista;

                    lista = repository.GetList(fieldFilters, query, sort, page, start, limit, ref totalRecords);

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
                    CustomsClearenceDetail estatus = repository.Get(id);

                    object json = new
                    {
                        data = estatus,
                        success = true
                    };

                    return json;
                }
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);

                object json = new
                {
                    message = ex.Message,
                    success = false
                };

                return json;
            }
        }

        public object Post(CustomsClearenceDetail added)
        {
            object json;

            try
            {
                CustomsClearenceDetail posted = repository.Add(added);

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
                        success = false
                    };
                };
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

        public object Put(CustomsClearenceDetail updated)
        {
            object json;

            try
            {
                CustomsClearenceDetail putting = repository.Update(updated);

                json = new
                {
                    total = 1,
                    data = putting,
                    success = true
                };
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

        public object Delete(CustomsClearenceDetail deleted)
        {
            object json;

            try
            {
                bool result = repository.Remove(deleted);
                json = new
                {
                    success = result
                };
            } catch(Exception ex) {
                json = new
                {
                    success = false,
                    message = ex.Message
                };

            }

            return json;
        }
    }
}