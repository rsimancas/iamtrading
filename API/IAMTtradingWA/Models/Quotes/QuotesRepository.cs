using Helpers;
using IAMTradingWA.Clases;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public class QuotesRepository : IQuotesRepository
    {
        static readonly ICustomsClearenceRepository customsClearenceRepo = new CustomsClearenceRepository();
        static readonly IGeneralChargesRepository generalChargesRepo = new GeneralChargesRepository();
        static readonly IChargesDescriptionsRepository chargesDescRepo = new ChargesDescriptionsRepository();

        #region Quote Header
        public IList<QuoteHeader> GetListHeader(int roleId, string filterDateField, Decimal filterBalance, string strDateFrom, string strDateTo, string FilterShowWithInvoice, string query, Filter filter, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            string wherepage = (page != 0) ? String.Format("row>{0}", start) : "1=1";
            string where = "1=1";

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
                where += (!string.IsNullOrEmpty(strDateFrom) && !string.IsNullOrEmpty(strDateTo)) ? " AND QHeaderId in (select QHeaderId FROM PurchaseOrders WHERE POrderType='IN' AND POrderDate BETWEEN @dateFrom AND @dateTo) " : "";
                where += (!string.IsNullOrEmpty(strDateFrom) && string.IsNullOrEmpty(strDateTo)) ? " AND QHeaderId in (select QHeaderId FROM PurchaseOrders WHERE POrderType='IN' AND POrderDate>=@dateFrom) " : "";
                where += (string.IsNullOrEmpty(strDateFrom) && !string.IsNullOrEmpty(strDateTo)) ? " AND QHeaderId in (select QHeaderId FROM PurchaseOrders WHERE POrderType='IN' AND POrderDate<=@dateTo) " : "";
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

            if (FilterShowWithInvoice == "Ex.V +")
            {
                where += " AND x_ExchangeVariation > 0 ";
            }

            if (FilterShowWithInvoice == "Ex.V -")
            {
                where += " AND x_ExchangeVariation < 0 ";
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

            // RoleId 5
            if (roleId == 5)
            {
                where += (!string.IsNullOrEmpty(where) ? " and " : "") + "BrokerId = 3";
            }

            // Handle Orders
            string order = "QHeaderDate";
            string direction = "DESC";

            if (roleId == -1)
            {
                order = "x_DefaultOrder, QHeaderDate";
                direction = "ASC";
            }

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            decimal tasa = Utils.GetDolarTodayRate();

            string sql = @"
                IF OBJECT_ID('tempdb..#tmpResults') IS NOT NULL
                DROP TABLE #tmpResults;

	            SELECT *,@DolarTodayRate as CurRate, ROW_NUMBER() OVER (ORDER BY {2} {3}) as row
                INTO #tmpResults
                FROM dbo.fn_GetListQuotes(@DolarTodayRate, @dateFrom, @dateTo) 
                WHERE {0}

                SELECT " + ((@limit > 0) ? String.Format(" TOP {0} ", @limit) : "") + @" *,
                ISNULL(t1.Total1,0) as x_ExchVarHistory, t1.x_CostInQuotes, t1.x_CubicFeetInQuotes, t1.x_ExchangeVariationInQuotes,
                t1.x_GrandInvoiceBalance, t1.x_ProfitInQuotes, t1.x_TotalInQuotes, t1.x_VolumeWeightInQuotes, t1.x_ICInQuotes as x_ICInQuotes,     
                t2.Total2 as x_TotalPorAprobacion, t2.Count as x_CountPorAprobacion,    
                t4.x_DaysAvg, t5.TotalRecords, t6.x_DolarIAM
                FROM #tmpResults
                CROSS APPLY ((select sum(x_ExchangeVariation) as Total1, 
                                    sum(x_Total) as x_TotalInQuotes,sum(x_TotalBS) as x_TotalBSInQuotes,sum(x_Cost) as x_CostInQuotes, sum(x_Profit) as x_ProfitInQuotes,
                                    sum(QHeaderVolumeWeight) as x_VolumeWeightInQuotes, sum(QHeaderCubicFeet) as x_CubicFeetInQuotes,
					                sum(x_ExchangeVariation) as x_ExchangeVariationInQuotes, sum(x_InvoiceBalance) as x_GrandInvoiceBalance,
                                    sum(x_InternalCharges)  as x_ICInQuotes,sum(x_Paid) as x_GrandPaid, sum(POBalance) as x_GrandPOBalance
                                from #tmpResults WHERE QHeaderStatusInfo<>'ANULADA')) as t1 
                CROSS APPLY ((select sum(x_Total) as Total2, Count(*) as Count from #tmpResults WHERE QHeaderStatusInfo in ('POR REEMPLAZO','COTIZADA'))) as t2
                CROSS APPLY ((select SUM(x_DateApproved)/COUNT(*) as x_DaysAvg from #tmpResults WHERE x_DateApproved > 0)) as t4
                CROSS APPLY ((select TOP 1 row as TotalRecords from #tmpResults order by row desc)) as t5
                CROSS APPLY ((select (SUM(QHeaderCurrencyRate)/COUNT(*)) as x_DolarIAM from #tmpResults WHERE QHeaderStatusInfo<>'ANULADA' AND QHeaderCurrencyRate <> 0)) as t6
                WHERE {1}  
                ORDER BY row ";

            where = (where.StartsWith("1=1 AND ")) ? where.Replace("1=1 AND ", "") : where;
            sql = String.Format(sql, where, wherepage, order, direction);

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

                IList<QuoteHeader> data = EnumExtension.ToList<QuoteHeader>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public QuoteHeader GetHeader(int id, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            };

            QuoteHeader data = GetHeader(id, oConn);

            // Check if this Quote General Charges
            var generalCharges = generalChargesRepo.GetListByQuote(data.QHeaderId);

            if (generalCharges.Count == 0)
                loadGeneralCharges(data);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private void loadGeneralCharges(QuoteHeader data)
        {
            var list = chargesDescRepo.GetList();

            if (list.Count == 0) return;

            foreach (var item in list)
            {
                var gcharge = new GeneralCharge();

                gcharge.ChargeDescId = item.ChargeDescId;
                gcharge.QHeaderId = data.QHeaderId;
                gcharge.GChargeFactor = item.ChargeDefaultFactor;
                gcharge.GChargeCreatedDate = data.QHeaderCreatedDate;
                gcharge.GChargeCreatedBy = data.QHeaderCreatedBy;

                generalChargesRepo.Add(gcharge);
            }

        }

        public QuoteHeader AddHeader(QuoteHeader data, ref string msgError)
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
            };

            data.QHeaderCreatedDate = DateTime.Now;
            string sql = "INSERT INTO QuoteHeader ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";


            EnumExtension.setListValues(data, "QHeaderId", ref sql);


            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            QuoteHeader returnData = GetHeader(keyGenerated, oConn);

            InsertCustomClearence(returnData, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private void InsertCustomClearence(QuoteHeader quote, SqlConnection oConn)
        {
            try
            {
                CustomsClearence cc = new CustomsClearence();
                cc.CClearenceCreatedBy = quote.QHeaderModifiedBy ?? quote.QHeaderCreatedBy;
                cc.CClearenceCreatedDate = DateTime.Now;
                cc.CClearenceCurrencyCode = "USD";
                cc.CClearenceCurrencyRate = quote.QHeaderCurrencyRate;
                cc.CClearenceDate = quote.QHeaderCreatedDate;
                cc.CClearenceMode = 0;
                cc.QHeaderId = quote.QHeaderId;

                string sql = "INSERT INTO CustomsClearence ({0}) VALUES ({1}) " +
               "SELECT SCOPE_IDENTITY()";

                EnumExtension.setListValues(cc, "CClearenceId", ref sql);

                SqlCommand cmd = new SqlCommand(sql, oConn);

                int keyGenerated = 0;
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }
        }

        public QuoteHeader UpdateHeader(QuoteHeader data, ref string msgError)
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
            };

            QuoteHeader oldData = GetHeader(data.QHeaderId, oConn);

            data.QHeaderModifiedDate = DateTime.Now;
            string sql = "UPDATE QuoteHeader SET {0} WHERE QHeaderId = " + data.QHeaderId.ToString();

            EnumExtension.setUpdateValues(data, "QHeaderId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                LogManager.Write("SQL: " + Environment.NewLine + "\t " + sql);
                msgError = ex.Message;
                return null;
            }

            QuoteHeader returnData = GetHeader(data.QHeaderId, oConn);

            if (oldData.QHeaderCost != returnData.QHeaderCost)
            {
                RecalcItemCost(returnData, oConn);
            }

            if (customsClearenceRepo.GetByQuote(returnData.QHeaderId, 0) == null)
            {
                InsertCustomClearence(returnData, oConn);
            }

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QuoteHeader GetHeader(int id, SqlConnection oConn)
        {
            decimal tasa = Utils.GetDolarTodayRate();

            string sql = @"
                    IF OBJECT_ID('tempdb..#tmpResults') IS NOT NULL
                        DROP TABLE #tmpResults;

                    SELECT *,@DolarTodayRate as CurRate
                    INTO #tmpResults
                    FROM dbo.fn_GetListQuotes(@DolarTodayRate, @dateFrom, @dateTo) a
                    WHERE a.QHeaderId = @id

                    SELECT *,
                    ISNULL(t1.Total1,0) as x_ExchVarHistory, t1.x_CostInQuotes, t1.x_CubicFeetInQuotes, t1.x_ExchangeVariationInQuotes,
                    t1.x_GrandInvoiceBalance, t1.x_ProfitInQuotes, t1.x_TotalInQuotes, t1.x_VolumeWeightInQuotes, t1.x_ICInQuotes as x_ICInQuotes,     
                    t2.Total2 as x_TotalPorAprobacion, t2.Count as x_CountPorAprobacion,    
                    t4.x_DaysAvg, 1 as TotalRecords, t6.x_DolarIAM
                    FROM #tmpResults
                    CROSS APPLY ((select sum(x_ExchangeVariation) as Total1, 
                                        sum(x_Total) as x_TotalInQuotes,sum(x_TotalBS) as x_TotalBSInQuotes,sum(x_Cost) as x_CostInQuotes, sum(x_Profit) as x_ProfitInQuotes,
                                        sum(QHeaderVolumeWeight) as x_VolumeWeightInQuotes, sum(QHeaderCubicFeet) as x_CubicFeetInQuotes,
					                    sum(x_ExchangeVariation) as x_ExchangeVariationInQuotes, sum(x_InvoiceBalance) as x_GrandInvoiceBalance,
                                        sum(x_InternalCharges)  as x_ICInQuotes,sum(x_Paid) as x_GrandPaid, sum(POBalance) as x_GrandPOBalance
                                    from #tmpResults WHERE QHeaderStatusInfo<>'ANULADA')) as t1 
                    CROSS APPLY ((select sum(x_Total) as Total2, Count(*) as Count from #tmpResults WHERE QHeaderStatusInfo in ('POR REEMPLAZO','COTIZADA'))) as t2
                    CROSS APPLY ((select SUM(x_DateApproved)/COUNT(*) as x_DaysAvg from #tmpResults WHERE x_DateApproved > 0)) as t4
                    CROSS APPLY ((select (SUM(QHeaderCurrencyRate)/COUNT(*)) as x_DolarIAM from #tmpResults WHERE QHeaderStatusInfo<>'ANULADA' AND QHeaderCurrencyRate <> 0)) as t6";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);
            da.SelectCommand.Parameters.Add("@DolarTodayRate", SqlDbType.Decimal).Value = tasa;

            DateTime dateFrom, dateTo;

            dateFrom = DateTime.Now.AddYears(-10);
            dateTo = DateTime.Now;
            dateTo = new DateTime(dateTo.Year, dateTo.Month, dateTo.Day, 23, 59, 59);

            da.SelectCommand.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom;
            da.SelectCommand.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<QuoteHeader> data = EnumExtension.ToList<QuoteHeader>(dt);
                return data.FirstOrDefault<QuoteHeader>();
            }

            return null;
        }

        public bool RemoveHeader(QuoteHeader data, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return false;
            };

            bool result;
            try
            {
                result = RemoveHeader(data, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool RemoveHeader(QuoteHeader data, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteHeader " +
                         " WHERE (QHeaderId = {0})";

            sql = String.Format(sql, data.QHeaderId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        private void RecalcItemCost(QuoteHeader data, SqlConnection oConn)
        {
            string sql = "Select QDetailId,QDetailLineTotal,QDetailQty FROM QuoteDetails " +
                         " WHERE (QHeaderId = {0})";

            sql = String.Format(sql, data.QHeaderId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            SqlDataReader reader = cmd.ExecuteReader();
            cmd.Dispose();

            if (reader.HasRows)
            {
                int detailId;
                decimal lineTotal;
                decimal qty;

                while (reader.Read())
                {
                    detailId = reader.GetInt32(0);
                    lineTotal = reader.GetDecimal(1);
                    qty = reader.GetDecimal(2);

                    decimal factor = (Convert.ToDecimal(data.QHeaderTotal) != 0) ? lineTotal / Convert.ToDecimal(data.QHeaderTotal) : 0;
                    decimal lineCost = Math.Round(Convert.ToDecimal(data.QHeaderCost) * factor, 2);
                    decimal unitCost = Math.Round(lineCost / qty, 2);

                    string strLineCost = lineCost.ToString().Replace(',', '.');
                    string strUnitCost = unitCost.ToString().Replace(',', '.');

                    sql = "update x set x.QDetailLineCost = {0}, x.QDetailCost = {1} from QuoteDetails x where QDetailId={2}";
                    sql = String.Format(sql, strLineCost, strUnitCost, detailId);

                    cmd = new SqlCommand(sql, oConn);
                    cmd.ExecuteNonQuery();
                    cmd.Dispose();
                }
            }

            reader.Close();
        }
        #endregion Quote Header

        #region Quote Details
        public IList<QuoteDetail> GetListDetail(int qHeaderId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            // Si se pasa como parametro el Header Id filtramos por el mismo
            where += (qHeaderId > 0) ? String.Format(" AND a.QHeaderId = {0}", qHeaderId) : "";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "b.ItemName + c.VendorName + b.ItemGYCode";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.QDetailId";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "  SELECT a.*, b.ItemName as x_ItemName, c.VendorName as x_VendorName, b.ItemGYCode as x_ItemGYCode, " +
                         "   h.QHeaderDate as x_QHeaderDate,h.QHeaderReference as x_QHeaderReference, h.QHeaderOC as x_QHeaderOC, " +
                         "   h.QHeaderOCDate as x_QHeaderOCDate, h.QHeaderStatusInfo as x_QHeaderStatusInfo, h.QHeaderEstimatedDate as x_QHeaderEstimatedDate, " +
                         "   h.QHeaderComments as x_QHeaderComments, ISNULL(s.StatusName,'') as x_StatusName, " +
                         "   ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "   IsNull((select count(*) from QuoteDetails a WHERE {0}),0)  as TotalRecords   " +
                         "  FROM QuoteDetails a INNER JOIN Items b ON a.ItemId = b.ItemId " +
                         "    INNER JOIN Vendors c ON a.VendorId = c.VendorId " +
                         "    INNER JOIN QuoteHeader h ON h.QHeaderId=a.QHeaderId LEFT JOIN Status s ON h.StatusId=s.StatusId " +
                         "  WHERE {0}) a  " +
                         " WHERE {1} " +
                         " ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

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

                IList<QuoteDetail> data = EnumExtension.ToList<QuoteDetail>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public QuoteDetail GetDetail(int id, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            };

            QuoteDetail data = GetDetail(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public QuoteDetail AddDetail(QuoteDetail data, ref string msgError)
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
            };

            string sql = "INSERT INTO QuoteDetails ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            // Setting Line Cost Total
            data.QDetailLineCost = Math.Round(Convert.ToDecimal(data.QDetailCost) * data.QDetailQty, 2);

            EnumExtension.setListValues(data, "QDetailId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            QuoteDetail returnData = GetDetail(keyGenerated, oConn);

            bool result = UpdateTotals(returnData, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public QuoteDetail UpdateDetail(QuoteDetail data, ref string msgError)
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
            };

            string sql = "UPDATE QuoteDetails SET {0} WHERE QDetailId = " + data.QDetailId.ToString();

            // Setting Line Cost Total
            data.QDetailLineCost = Math.Round(Convert.ToDecimal(data.QDetailCost) * data.QDetailQty, 2);

            EnumExtension.setUpdateValues(data, "QDetailId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            QuoteDetail returnData = GetDetail(data.QDetailId, oConn);

            bool result = UpdateTotals(returnData, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private QuoteDetail GetDetail(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.*, b.ItemName as x_ItemName, c.VendorName as x_VendorName, b.ItemGYCode as x_ItemGYCode  " +
                         " FROM QuoteDetails a INNER JOIN Items b ON a.ItemId = b.ItemId " +
                         " INNER JOIN Vendors c ON a.VendorId = c.VendorId " +
                         " WHERE (a.QDetailId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<QuoteDetail> data = EnumExtension.ToList<QuoteDetail>(dt);
                return data.FirstOrDefault<QuoteDetail>();
            }

            return null;
        }

        public bool RemoveDetail(QuoteDetail data, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return false;
            };

            bool result;
            try
            {
                result = RemoveDetail(data, oConn);
                result = UpdateTotals(data, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool RemoveDetail(QuoteDetail data, SqlConnection oConn)
        {
            string sql = "DELETE FROM QuoteDetails " +
                         " WHERE (QDetailId = {0})";

            sql = String.Format(sql, data.QDetailId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        private bool UpdateTotals(QuoteDetail data, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return false;
            };

            bool result;
            try
            {
                result = UpdateTotals(data, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            ConnManager.CloseConn(oConn);

            return result;
        }

        private bool UpdateTotals(QuoteDetail data, SqlConnection oConn)
        {
            string sql = "UPDATE x set x.QHeaderCost = (SELECT SUM(y.QDetailLineCost) FROM QuoteDetails y WHERE x.QHeaderId=y.QHeaderId), " +
                         "   x.QHeaderTotal = (Select SUM(d.QDetailLineTotal) from QuoteDetails d where x.QHeaderId=d.QHeaderId) " +
                         " FROM QuoteHeader x  " +
                         " WHERE (x.QHeaderId = {0})";

            sql = String.Format(sql, data.QHeaderId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Quote Details

        #region "Some Functions"
        public Decimal GetProfit(int qHeaderId, ref string msgError)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return 0;
            };

            Decimal data = GetProfit(qHeaderId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private Decimal GetProfit(int id, SqlConnection oConn)
        {
            decimal result = 0;

            string sql = "SELECT dbo.fn_GetProfitById(@id)";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            try
            {
                result = Convert.ToDecimal(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                return 0;
            }

            return result;
        }
        #endregion "Some Functions"

    }
}