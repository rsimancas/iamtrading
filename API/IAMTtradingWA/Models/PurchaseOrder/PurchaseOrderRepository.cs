﻿using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        #region Purchase Order
        public IList<PurchaseOrder> GetList(int qHeaderId, int pOrderParentId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            // add some filters
            where += (qHeaderId > 0) ? String.Format(" AND a.QHeaderId = {0}", qHeaderId) : "";
            where += (pOrderParentId > 0) ? String.Format(" AND a.POrderParentId = {0}", pOrderParentId) : "";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.POrderPaymentNumber";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.POrderDate";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "WITH qData " +
                         " AS ( " +
                         " SELECT a.*, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row " +
                         " FROM PurchaseOrders a " +
                         " WHERE {0}) " +
                         "SELECT *, " +
                         "  IsNull((select count(*) from qData),0)  as TotalRecords " +
                         "FROM qData " + 
                         "WHERE {1} " +
                         "ORDER BY row";

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

                IList<PurchaseOrder> data = EnumExtension.ToList<PurchaseOrder>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public PurchaseOrder Get(int id, ref string msgError)
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

            PurchaseOrder data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public PurchaseOrder Add(PurchaseOrder data, ref string msgError)
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

            data.POrderCreatedDate = DateTime.Now;
            string sql = "INSERT INTO PurchaseOrders ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "POrderId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();

            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
                if (data.POrderType == "PO")
                {
                    cmd.Dispose();
                    cmd.CommandText = String.Format("UPDATE QuoteHeader SET QHeaderOC='{1}' WHERE QHeaderId={0}", data.QHeaderId, data.POrderPaymentNumber);
                    cmd.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                cmd.Dispose();
                oTX.Rollback();
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            oTX.Commit();
            cmd.Dispose();

            PurchaseOrder returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public PurchaseOrder Update(PurchaseOrder data, ref string msgError)
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

            data.POrderModifiedDate = DateTime.Now;
            string sql = "UPDATE PurchaseOrders SET {0} WHERE POrderId = " + data.POrderId.ToString();

            EnumExtension.setUpdateValues(data, "POrderId", ref sql);

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

            PurchaseOrder returnData = Get(data.POrderId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private PurchaseOrder Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.* " +
                         "FROM PurchaseOrders a " +
                         " WHERE (a.POrderId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<PurchaseOrder> data = EnumExtension.ToList<PurchaseOrder>(dt);
                return data.FirstOrDefault<PurchaseOrder>();
            }

            return null;
        }

        public bool Remove(PurchaseOrder data, ref string msgError)
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
                result = Remove(data, oConn);
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

        private bool Remove(PurchaseOrder data, SqlConnection oConn)
        {
            string sql = "DELETE FROM PurchaseOrders " +
                         " WHERE (POrderId = {0})";

            sql = String.Format(sql, data.POrderId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Purchase Order

    }
}