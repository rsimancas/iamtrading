﻿using IAMTradingWA.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using Utilidades;


namespace IAMTradingWA.Controllers
{
    
    [TokenValidation]
    public class PaySelectedController : ApiController
    {
        static readonly IVendorsRepository repository = new VendorsRepository();

        [HttpPost]
        public object Post(Payment Paid)
        {
            var queryValues = Request.RequestUri.ParseQueryString();

            int VendorId = Convert.ToInt32(queryValues["VendorId"]);
            string currentUser = queryValues["CurrentUser"];

            try
            {
                string msg = "";
                object json;
                bool success = repository.Pay(VendorId, currentUser, Paid, ref msg);

                json = new
                {
                    success = true,
                    message = msg
                };

                return json;
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
    }
}