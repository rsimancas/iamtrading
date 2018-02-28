using Helpers;
using IAMTradingWA.Models;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using Utilidades;

namespace IAMTradingWA.Areas.Reports.Controllers
{
    public class Export2ExcelController : Controller
    {
        static readonly IUsersRepository userRepository = new UsersRepository();
        static readonly IQuotesRepository quoteRepository = new QuotesRepository();
        static NameValueCollection queryValues = null;
        static User currentUser = null;

        //
        // GET: /Reports/QuoteCustomer/
        public ActionResult Index()
        {
            if (!CheckToken(Request.Headers))
            {
                LogManager.Write("ERROR TOKEN");
                return RedirectToAction("Error");
            }

            queryValues = Request.QueryString;

            int page = 0;
            int start = 0;
            int limit = 0;
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

            Models.Filter filter;

            if (!string.IsNullOrWhiteSpace(strFilter))
            {
                filter = JsonConvert.DeserializeObject<Models.Filter>(strFilter);
            }
            else
            {
                filter = new Models.Filter();
            }
            #endregion Configuramos el filtro de la consulta si se obtuvo como parametro

            string query = !string.IsNullOrWhiteSpace(queryValues["query"]) ? queryValues["query"] : "";

            //queryValues = Request.QueryString;
            IList<QuoteHeader> lista;
            int totalRecords = 0;
            string msgError = "";

            lista = quoteRepository.GetListHeader(roleId, filterDateField, filterBalance, strDateFrom, strDateTo, FilterShowWithInvoice, query, filter, sort, page, start, limit, ref totalRecords, ref msgError);

            //DataTable dtHeader = GetQuotes(roleId, strDateFrom, strDateTo, query, filter, sort, page, start, limit);
            LocalReport lr = new LocalReport();

            try
            {
                lr.DataSources.Clear();
                lr.DataSources.Add(new ReportDataSource("dsQuotes", lista));

                if (roleId == -1)
                {
                    lr.ReportPath = "bin/Areas/Reports/ReportDesign/ReportQuotesGY.rdlc";
                }
                else
                {
                    lr.ReportPath = "bin/Areas/Reports/ReportDesign/ReportQuotes.rdlc";
                }

                string reportType = "EXCELOPENXML";
                string mimeType;
                string encoding;
                string fileNameExtension;

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

                string fileName = Utils.GetTempFileNameWithExt("xlsx");
                FileStream fs = new FileStream(fileName, FileMode.OpenOrCreate);
                fs.Write(bytes, 0, bytes.Length);
                fs.Close();


                return Content(Path.GetFileNameWithoutExtension(fileName));
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return RedirectToAction("Error");
            }
        }

        public ActionResult Error()
        {
            return View();
        }

        public DataTable GetQuotes(int roleId, string receivedFrom, string receivedTo, string query, IAMTradingWA.Models.Filter filter, Sort sort, int page, int start, int limit)
        {
            limit = limit + start;

            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };

            string wherepage = (page != 0) ? String.Format("row>{0} and row<={1} ", start, limit) : "1=1";
            string where = "1=1";

            // Set received filter date
            DateTime dateReceivedFrom, dateReceivedTo;

            dateReceivedFrom = (!string.IsNullOrEmpty(receivedFrom)) ? Convert.ToDateTime(receivedFrom) : DateTime.Now;
            dateReceivedTo = (!string.IsNullOrEmpty(receivedTo)) ? Convert.ToDateTime(receivedTo) : DateTime.Now;

            dateReceivedTo = new DateTime(dateReceivedTo.Year, dateReceivedTo.Month, dateReceivedTo.Day, 23, 59, 59);

            where += (!string.IsNullOrEmpty(receivedFrom)) ? " AND dbo.fn_GetPurchaseOrderDate(a.QHeaderId) >= @receivedFrom " : "";
            where += (!string.IsNullOrEmpty(receivedTo)) ? " AND dbo.fn_GetPurchaseOrderDate(a.QHeaderId) <= @receivedTo " : "";


            #region Filtros
            if (!string.IsNullOrWhiteSpace(filter.property))
            {
                where += String.Format(" and a.{0} = {1}", filter.property, filter.value);
            }
            #endregion Filtros

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.QHeaderReference+dbo.fn_GetVendor(a.QHeaderId)+ISNULL(e.StatusName,'')+ISNULL(a.QHeaderOC,'')+ISNULL(a.QHeaderStatusInfo,'')+ISNULL(f.BrokerName,'')+ISNULL(g.CustName,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Orders
            string order = "a.QHeaderDate";
            string direction = "DESC";

            if (roleId == -1)
            {
                order = "dbo.fn_GetOrderQuoteHeader(a.QHeaderStatusInfo), a.QHeaderDate";
                direction = "ASC";
            }

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;

                if (order == "x_DateApproved") order = "ISNULL(DATEDIFF(DD, a.QHeaderDate, ISNULL(dbo.fn_GetPurchaseOrderDate(a.QHeaderId),a.QHeaderOCDate)), (CASE WHEN a.QHeaderStatusInfo='COTIZADA' THEN DATEDIFF(DD, a.QHeaderDate,getdate()) ELSE 0 END))";
            }

            decimal tasa = Utils.GetDolarTodayRate();

            string sql = "WITH qData " +
                         " AS ( " +
                         " SELECT a.*, " +
                         "   ISNULL(e.StatusName,'') as x_StatusName, ISNULL(f.BrokerName,'') as x_BrokerName, ISNULL (g.CustName,'') as x_CustName, " +
                         "   dbo.fn_GetVendor(a.QHeaderId) as x_VendorName, dbo.fn_GetProfit(a.QHeaderId) as x_Profit, " +
                         "   dbo.fn_ExchangeVariation(a.QHeaderId, @DolarTodayRate)*-1 as x_ExchangeVariation, " +
                         "   dbo.fn_GetPurchaseOrderDate(a.QHeaderId) as x_DateOrderReceived, " +
                         "   dbo.fn_GetPORate(a.QHeaderId) as x_PORate, " +
                         "   dbo.fn_GetPBRate(a.QHeaderId) as x_PBRate, " +
                         "   ISNULL(DATEDIFF(DD, a.QHeaderDate, ISNULL(dbo.fn_GetPurchaseOrderDate(a.QHeaderId),a.QHeaderOCDate)), (CASE WHEN a.QHeaderStatusInfo='COTIZADA' THEN DATEDIFF(DD, a.QHeaderDate,getdate()) ELSE 0 END)) as x_DateApproved, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row " +
                         " FROM QuoteHeader a LEFT JOIN Status e ON a.StatusId=e.StatusId " +
                         "  LEFT JOIN Brokers f ON a.BrokerId = f.BrokerId " +
                         "  LEFT JOIN Customers g ON a.CustId = g.CustId " +
                         " WHERE {0}) " +
                         "SELECT *,ISNULL((select sum(QHeaderTotal) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_TotalInQuotes, " +
                         "  ISNULL((select sum(QHeaderCost) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_CostInQuotes, " +
                         "  ISNULL((select sum(x_Profit) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_ProfitInQuotes, " +
                         "  ISNULL((select sum(QHeaderVolumeWeight) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_VolumeWeightInQuotes, " +
                         "  ISNULL((select sum(QHeaderCubicFeet) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_CubicFeetInQuotes, " +
                         "  (CASE WHEN QHeaderTotal IS NOT NULL AND QHeaderTotal>0 THEN ROUND(ISNULL(x_Profit/QHeaderTotal,0)*100,2) ELSE 0 END) as x_ProfitPct , " +
                         "  ISNULL((select sum(x_ExchangeVariation) from qData WHERE QHeaderStatusInfo<>'ANULADA'),0) as x_ExchangeVariationInQuotes, " +
                         "  ISNULL((select SUM(x_DateApproved)/COUNT(*) from qData WHERE x_DateApproved > 0),0) as x_DaysAvg, " +
                         "  ISNULL((select SUM(QHeaderCurrencyRate)/COUNT(*) from qData WHERE QHeaderCurrencyRate <> 0 AND QHeaderStatusInfo<>'ANULADA'),0) as x_DolarIAM, " +
                         "  ISNULL(t1.Total,0) as x_ExchVarHistory, " +
                         "  ISNULL(t2.Total,0) as x_TotalPorAprobacion, ISNULL(t2.Count,0) as x_CountPorAprobacion, " +
                         "  IsNull((select count(*) from qData),0)  as TotalRecords " +
                         "FROM qData " +
                         " LEFT OUTER JOIN ((select sum(dbo.fn_ExchangeVariation(QHeaderId, @DolarTodayRate)*-1) as total from QuoteHeader WHERE QHeaderStatusInfo<>'ANULADA')) as t1 ON 1=1 " +
                         " LEFT OUTER JOIN ((select sum(QHeaderTotal) as Total, Count(*) as Count from QuoteHeader WHERE QHeaderStatusInfo in ('POR REEMPLAZO','COTIZADA'))) as t2 ON 1=1 " +
                         "WHERE {1} " +
                         "ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@DolarTodayRate", SqlDbType.Decimal).Value = tasa;

            // Setting params for Received Date
            if (!string.IsNullOrEmpty(receivedFrom))
            {
                da.SelectCommand.Parameters.Add("@receivedFrom", SqlDbType.DateTime).Value = dateReceivedFrom;
            }

            if (!string.IsNullOrEmpty(receivedTo))
            {
                da.SelectCommand.Parameters.Add("@receivedTo", SqlDbType.DateTime).Value = dateReceivedTo;
            }

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

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

