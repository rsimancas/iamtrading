using IAMTradingWA.Models;
//using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Web.Mvc;
using Utilidades;

namespace IAMTradingWA.Areas.Reports.Controllers
{
    public class GetExcelController : Controller
    {
        static readonly IUsersRepository userRepository = new UsersRepository();
        static NameValueCollection queryValues = null;
        static string currentUser = "";

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {

            //dynamic objPB = Activator.CreateInstance(Type.GetTypeFromProgID("XStandard.MD5"));
            //string key = "que clave tan hija de puta ?";
            //LogManager.Write(Utils.GetMd5Hash(key));
            //Utils.ReadDBFUsingOdbc();
            //if (!CheckToken(Request.Headers))
            //{
            //    return RedirectToAction("Error");
            //}
            //return RedirectToAction("GetPDF");

            queryValues = Request.QueryString;
            string pdfFile = Path.Combine(Path.GetTempPath(), queryValues["_file"] + ".xlsx");

            byte[] b = new byte[1024];

            // Open the stream and read it back. 
            try
            {
                b = Utils.ReadFile(pdfFile);
                System.IO.File.Delete(pdfFile);
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return RedirectToAction("Error");
            }

            Response.ClearContent();
            Response.Buffer = true;

            return File(b, "application/ms-excel", "Quotes.xlsx");

        }

        private bool CheckToken(NameValueCollection headers)
        {
            string token;

            try
            {
                token = headers.GetValues("Authorization-Token").First();
            }
            catch (Exception)
            {
                return false;
            }

            try
            {
                string[] split = token.Split(',');

                string usrName = Utils.Decrypt(split[0]);
                string usrPwd = Utils.Decrypt(split[1]);

                var userLogged = userRepository.ValidLogon(usrName, usrPwd);

                if (userLogged == null)
                {
                    return false;
                };

                currentUser = userLogged.UserId;
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public ActionResult Error()
        {
            return View();
        }

    }
}

