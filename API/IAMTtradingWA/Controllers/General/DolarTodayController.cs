﻿using IAMTradingWA.Models;
using Newtonsoft.Json;
using System;
using System.Data.SqlClient;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;


namespace IAMTradingWA.Controllers
{
    
    //[TokenValidation]
    public class DolarTodayController : ApiController
    {
        //static readonly IBrokersRepository repository = new BrokersRepository();

        public object GetAll()
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int page = Convert.ToInt32(queryValues["page"]);
            int start = Convert.ToInt32(queryValues["start"]);
            int limit = Convert.ToInt32(queryValues["limit"]);
            int id = Convert.ToInt32(queryValues["id"]);
            int orden = Convert.ToInt32(queryValues["orden"]);


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

            try
            {
                object json;
                Models.CurrRate curRate = new CurrencyRatesRepository().GetLastRegisteredRate();

                decimal tasa = (curRate != null) ? curRate.CurrencyRate : 0;

                if (curRate == null || DateTime.Now >= curRate.CurrencyDate.AddMinutes(5))
                {
                    tasa = Utils.GetDolarTodayRate();
                    RegisterRate(tasa);
                }

                json = new
                {
                    total = 1,
                    data = new { USD = tasa},
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

        public void RegisterRate(decimal tasa)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            //data.CurrencyModified = DateTime.Now;
            string sql = @"if exists(select CurrencyRate from CurrencyRates where CAST(CurrencyDate AS DATE) = '{0}' ) 
                            Begin 
                            UPDATE CurrencyRates SET CurrencyRate = {1},CurrencyDate=getdate() 
                                WHERE CAST(CurrencyDate AS DATE) = '{0}'  
                            End 
                            else 
                            Begin 
                              INSERT INTO CurrencyRates (CurrencyCode, CurrencyDate, CurrencyRate) VALUES ('USD',getdate(),{1}) 
                            END ";

            sql = String.Format(sql, DateTime.Now.ToShortDateString(), tasa.ToString().Replace(',','.'));

            SqlCommand cmd = new SqlCommand(sql, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
            }
            finally
            {
                cmd.Dispose();
                ConnManager.CloseConn(oConn);
            }
        }
    }
}