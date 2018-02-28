using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public class QuoteChartRepository : IQuoteChartRepository
    {
        public IList<QuoteChart> GetData(int roleId, string filterDateField, Decimal filterBalance, string strDateFrom, string strDateTo, string FilterShowWithInvoice, string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
        {
            //limit = limit + start;

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

            string where = "x_DateOrderReceived is not null";

            // Set received filter date
            DateTime dateFrom, dateTo;

            dateFrom = (!string.IsNullOrEmpty(strDateFrom)) ? Convert.ToDateTime(strDateFrom) : DateTime.Now.AddYears(-10);
            dateTo = (!string.IsNullOrEmpty(strDateTo)) ? Convert.ToDateTime(strDateTo) : DateTime.Now;

            dateTo = new DateTime(dateTo.Year, dateTo.Month, dateTo.Day, 23, 59, 59);



            if (filterDateField == "Received")
            {
                where += (!string.IsNullOrEmpty(strDateFrom)) ? " AND x_DateOrderReceived >=@dateFrom " : "";
                where += (!string.IsNullOrEmpty(strDateTo)) ? " AND x_DateOrderReceived <=@dateTo " : "";
            }
            else if (filterDateField == "Paid")
            {
                where += (!string.IsNullOrEmpty(strDateFrom)) ? " AND x_PaidDate >=@dateFrom " : "";
                where += (!string.IsNullOrEmpty(strDateTo)) ? " AND x_PaidDate <=@dateTo " : "";

            }
            else if (filterDateField == "Invoiced")
            {
                where += (!string.IsNullOrEmpty(strDateFrom)) ? " AND InvoiceDate >=@dateFrom " : "";
                where += (!string.IsNullOrEmpty(strDateTo)) ? " AND InvoiceDate <=@dateTo " : "";
            }

            if (filterBalance > 0)
            {
                where += " AND x_InvoiceBalance >= @balance ";
            }

            if (FilterShowWithInvoice == "With Invoice")
            {
                where += " AND HasInvoice = 1 ";
            }

            if (FilterShowWithInvoice == "For Invoice")
            {
                where += " AND HasInvoice = 0 ";
            }

            #region Filtros
            if (!string.IsNullOrWhiteSpace(filter.property))
            {
                where += String.Format(" and {0} = {1}", filter.property, filter.value);
            }
            #endregion Filtros

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "";

                if (!query.ToUpper().StartsWith("FIANZA") && !query.ToUpper().StartsWith("CONDITION"))
                {
                    fieldName = "QHeaderReference+ISNULL(x_VendorName,'')+ISNULL(x_StatusName,'')+ISNULL(QHeaderOC,'')+ISNULL(QHeaderStatusInfo,'')+ISNULL(x_BrokerName,'')+ISNULL(x_CustName,'')+ISNULL(x_Condition,'')";
                    where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                        EnumExtension.generateLikeWhere(query, fieldName);
                }
                else
                {
                    if (query.ToUpper().StartsWith("FIANZA"))
                    {
                        string numFianza = query.Substring(6);
                        where += (!string.IsNullOrEmpty(where) ? " and " : "") + EnumExtension.generateLikeWhere(numFianza, "ISNULL(QHeaderNumFianza,'')");
                    }

                    if (query.ToUpper().StartsWith("CONDITION"))
                    {
                        string condition = query.Substring(9);
                        where += (!string.IsNullOrEmpty(where) ? " and " : "") + EnumExtension.generateLikeWhere(condition, "ISNULL(x_Condition,'')");
                    }
                }

            }

            decimal tasa = Utils.GetDolarTodayRate();

            string sql = @"
                With qData
                AS
                (
                    SELECT a.BrokerId,YEAR(a.x_DateOrderReceived) as Year,b.NUM,a.x_Total as Total,ISNULL(a.QHeaderVolumeWeight,0) as VolumeWeight,
			                b.Month + '-' + RIGHT(STR(YEAR(a.x_DateOrderReceived)),2) as Month
                    FROM dbo.fn_GetListQuotes(@DolarTodayRate, @dateFrom, @dateTo) a inner join dbo.fn_GetMonthsTable() b ON MONTH(a.x_DateOrderReceived) = b.NUM
                    WHERE {0}
                )
                SELECT a.Year,a.Month,SUM(a.Total) as Total,SUM(VolumeWeight) as VolumeWeight
                FROM qData a 
                GROUP BY a.Year,a.NUM,a.Month
                ORDER BY a.Year,a.NUM
                ";

            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ", "") : where;
            sql = String.Format(sql, where);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@DolarTodayRate", SqlDbType.Decimal).Value = tasa;

            // Setting params for Received Date
            //if (!string.IsNullOrEmpty(strDateFrom))
            //{
            da.SelectCommand.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom;
            //}

            //if (!string.IsNullOrEmpty(strDateTo))
            //{
            da.SelectCommand.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;
            //}

            if (filterBalance > 0)
            {
                da.SelectCommand.Parameters.Add("@balance", SqlDbType.Decimal).Value = filterBalance;
            }

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                errMsg = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = dt.Rows.Count;

            if (totalRecords > 0)
            {

                IList<QuoteChart> data = EnumExtension.ToList<QuoteChart>(dt);
                totalRecords = Convert.ToInt32(dt.Rows.Count);
                return data;
            }
            else
            {
                return null;
            }
        }
    }
}