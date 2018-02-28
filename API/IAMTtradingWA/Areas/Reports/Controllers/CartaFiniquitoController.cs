using IAMTradingWA.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using Utilidades;

namespace IAMTradingWA.Areas.Reports.Controllers
{
    public class CartaFiniquitoController : Controller
    {
        static readonly IUsersRepository userRepository = new UsersRepository();
        static NameValueCollection queryValues = null;
        static User currentUser = null;

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
            //    LogManager.Write("ERROR TOKEN");
            //    return RedirectToAction("Error");
            //}
            //return RedirectToAction("GetPDF");

            queryValues = Request.QueryString;
            int id = Convert.ToInt32(queryValues["id"]);

            DataTable dtHeader = GetData(id);
            //DataTable dtDetails = GetDetail(id);
            LocalReport lr = new LocalReport();

            lr.DataSources.Clear();
            lr.DataSources.Add(new ReportDataSource("dsCarta", dtHeader));
            //lr.DataSources.Add(new ReportDataSource("dsReciboViajeItemDetail", dtDetails));

            lr.ReportPath = "bin/Areas/Reports/ReportDesign/CartaFiniquito.rdlc";

            //lr.SubreportProcessing += new SubreportProcessingEventHandler(lr_SubreportProcessing);

            string reportType = "PDF";
            string mimeType;
            string encoding;
            string fileNameExtension;

            //ReportPageSettings rps = lr.GetDefaultPageSettings();

            string deviceInfo =
            "<DeviceInfo>" +
            "  <OutputFormat>" + id + "</OutputFormat>" +
            "  <PageWidth>8.5in</PageWidth>" +
            "  <PageHeight>11in</PageHeight>" +
            "  <MarginTop>0.2in</MarginTop>" +
            "  <MarginLeft>0.2in</MarginLeft>" +
            "  <MarginRight>0.2in</MarginRight>" +
            "  <MarginBottom>0.2in</MarginBottom>" +
            "</DeviceInfo>";

            Warning[] warnings;
            string[] streams;
            byte[] bytes;

            bytes = lr.Render(
                reportType,
                deviceInfo,
                out mimeType,
                out encoding,
                out fileNameExtension,
                out streams,
                out warnings);

            //string fileName = Utils.GetTempFileNameWithExt("pdf");
            //FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate);
            //fs.Write(bytes, 0, bytes.Length);
            //fs.Close();


            //return Content(Path.GetFileNameWithoutExtension(fileName));
            return File(bytes, mimeType);
        }

        public ActionResult Error()
        {
            return View();
        }

        private DataTable GetData(int id)
        {
            DataTable dt = new DataTable();
            using (SqlConnection oConn = ConnManager.OpenConn())
            {
                try
                {
                    string sql = @"SELECT b.BrokerName as BrokerName, QHeaderOC as NumOrden, QHeaderNumFianza as NumFianza,
                                    '{1}' as FECHA,
									CHAR(9)+CHAR(9)+CHAR(9)+CHAR(9)+'A través de la presente, cumplimos con notificarle que el compromiso derivado de la orden de compra Nº <b>' +
									QHeaderOC + '</b> entre <b>' + b.BrokerName + '</b> y mi representada, ' + 
									(CASE WHEN QHeaderNumFianza IS NOT NULL AND QHeaderNumFianza <> '' THEN 'respaldada con la FIANZA <b>' + QHeaderNumFianza + '</b>, ' ELSE '' END) +
									'fue finalizada de acuerdo a las condiciones pautadas por las partes.' as Body
                                FROM QuoteHeader a LEFT JOIN Brokers b on a.BrokerId = b.BrokerId
                                WHERE QHeaderId={0}";
                    sql = String.Format(sql, id, DateTime.Now.ToString("D", new CultureInfo("es-ES")));
                    SqlCommand cmd = new SqlCommand(sql, oConn);
                    SqlDataAdapter adp = new SqlDataAdapter(cmd);
                    adp.Fill(dt);
                }
                catch (Exception ex)
                {
                    while (ex != null)
                    {
                        LogManager.Write(ex.Message);
                        ex = ex.InnerException;
                    }
                }
            }
            return dt;
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

                currentUser = userLogged;
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return false;
            }

            return true;
        }

    }
}

