using IAMTradingWA.Models;
using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;


namespace IAMTradingWA.Controllers
{
    
    [TokenValidation]
    public class CleanUserVendorSelectionsController : ApiController
    {
        static readonly IVendorsRepository repository = new VendorsRepository();

        [HttpGet]
        public object Get()
        {
            var nvc = Request.RequestUri.ParseQueryString();
            int VendorId = Convert.ToInt32(nvc["VendorId"]);
            string UserId = nvc["UserId"];

            try
            {
                object json;

                repository.CleanUserVendorSelections(VendorId, UserId);

                json = new
                {
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

        //public void RegisterRate(decimal tasa)
        //{
        //    SqlConnection oConn = null;

        //    try
        //    {
        //        oConn = ConnManager.OpenConn();
        //    }
        //    catch (Exception ex)
        //    {
        //        LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
        //        throw;
        //    }

        //    //data.CurrencyModified = DateTime.Now;
        //    string sql = "if exists(select CurrencyRate from CurrencyRates where CAST(CurrencyDate AS DATE) = '{0}' ) " +
        //        " Begin " +
        //        " UPDATE CurrencyRates SET CurrencyRate = {1} where CAST(CurrencyDate AS DATE) = '{0}'  " +
        //        " End " +
        //        " else " +
        //        " Begin  " +
        //        "   INSERT INTO CurrencyRates (CurrencyCode, CurrencyDate, CurrencyRate) VALUES ('USD','{0}',{1}) " +
        //        " END ";

        //    sql = String.Format(sql, DateTime.Now.ToShortDateString(), tasa.ToString().Replace(',','.'));

        //    SqlCommand cmd = new SqlCommand(sql, oConn);

        //    try
        //    {
        //        cmd.ExecuteNonQuery();
        //    }
        //    catch (Exception ex)
        //    {
        //        ConnManager.CloseConn(oConn);
        //        LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
        //    }
        //    finally
        //    {
        //        cmd.Dispose();
        //        ConnManager.CloseConn(oConn);
        //    }
        //}
    }
}