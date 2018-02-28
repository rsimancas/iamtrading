using IAMTradingWA.Models;
using IAMTradingWA.Users;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;

namespace IAMTradingWA.Controllers
{
    
    [TokenValidation]
    public class PurchaseOrdersVendorsController : ApiController
    {
        static readonly IPurchaseOrdersVendorsRepository repository = new PurchaseOrdersVendorsRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            int orden = Convert.ToInt32(queryValues["orden"]);
            int pOrderParentId = Convert.ToInt32(queryValues["POVParentId"]);
            int qHeaderId = Convert.ToInt32(queryValues["QHeaderId"]);
            int vendorId = Convert.ToInt32(queryValues["VendorId"]);
            bool showOnlyCerradas = Convert.ToBoolean(queryValues["ShowOnlyCerradas"]);
            bool showOnlySelected = Convert.ToBoolean(queryValues["ShowOnlySelected"]);
            bool showOnlyWithBalance = Convert.ToBoolean(queryValues["ShowOnlyWithBalance"]);


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

            User currentUser = UsersManager.GetCurrentUser(Request);

            try
            {
                if (id == 0)
                {
                    object json;
                    string msgError = "";
                    IList<PurchaseOrderVendor> lista;

                    lista = repository.GetList(currentUser, vendorId, qHeaderId, pOrderParentId, showOnlyCerradas, showOnlySelected, showOnlyWithBalance, query, sort, page, start, limit, ref totalRecords, ref msgError);

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
                    PurchaseOrderVendor povdata = repository.Get(id, currentUser, ref msgError);

                    object json = new
                    {
                        data = povdata,
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

        public object Post(PurchaseOrderVendor added)
        {
            object json;
            string messageError = "";
            User currentUser = UsersManager.GetCurrentUser(Request);

            try
            {
                PurchaseOrderVendor posted = repository.Add(added, currentUser, ref messageError);

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

        public object Put(JObject updatedJSON)
        {
            User currentUser = UsersManager.GetCurrentUser(Request);

            IDictionary<String, object> updated = updatedJSON.ToObject<IDictionary<String, object>>();

            object json;

            try
            {
                string messageError = "";
                PurchaseOrderVendor putting = repository.Update(updated, currentUser, ref messageError);

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

        public object Delete(PurchaseOrderVendor deleted)
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