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
    public class AttachmentsController : ApiController
    {
        static readonly IAttachmentsRepository repository = new AttachmentsRepository();

        public object GetAll()
        {
            var nvc = Request.RequestUri.ParseQueryString();

            bool dirty = false;
            string strDirty = nvc["Dirty"];
            bool.TryParse(strDirty, out dirty);
            string currentUser = nvc["CurrentUser"];
            int PayVendorId = Convert.ToInt32(nvc["PayVendorId"]);

            int totalRecords = 0;

            try
            {
                    object json;
                    string msgError = "";
                    IList<Attached> lista;

                    lista = repository.GetList(dirty, currentUser, ref totalRecords, ref msgError, PayVendorId);

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

        public object Post(Img added)
        {
            object json = new
                {
                    message = "",
                    success = false
                };

            return json;
        }

        public object Put(JObject updatedJSON)
        {
            object json;

            try
            {
                IDictionary<String, object> updated = updatedJSON.ToObject<IDictionary<String, object>>();

                User currentUser = UsersManager.GetCurrentUser(Request);

                string messageError = "";
                Attached putting = repository.Update(updated, currentUser.UserId, ref messageError);

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

        public object Delete(Attached deleted)
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