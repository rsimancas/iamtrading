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
    public class PurchaseOrdersVendorsRepository : IPurchaseOrdersVendorsRepository
    {
        static readonly IUsersLastSelectionsRepository ULSRepository = new UsersLastSelectionsRepository();

        #region Purchase Order
        public IList<PurchaseOrderVendor> GetList(User currentUser, int vendorId, int qHeaderId, int pOrderParentId, bool showOnlyCerradas, bool showOnlySelected, bool showOnlyWithBalance, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string userId = (currentUser != null) ? currentUser.UserId : "";
            string wherepage = (page != 0) ? String.Format("row>{0} and row<={1} ", start, limit) : "1=1";
            string where = (showOnlyCerradas) ? "c.QHeaderStatusInfo = 'CERRADA'" : "1=1";
            where += (showOnlySelected) ? " AND d.POVId IS NOT NULL" : "";
            where += (showOnlyWithBalance) ? " AND ISNULL(dbo.fn_GetInvoiceVendorBalance(a.POVId, 0),0) <> 0" : "";

            // add some filters
            where += (qHeaderId > 0) ? String.Format(" AND a.QHeaderId = {0}", qHeaderId) : "";
            where += (pOrderParentId > 0) ? String.Format(" AND a.POVParentId = {0}", pOrderParentId) : "";
            where += (vendorId > 0) ? String.Format(" AND a.VendorId = {0}", vendorId) : "";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.POVPaymentNumber + ISNULL(c.QHeaderReference,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.POVDate";
            string direction = (vendorId > 0) ? "DESC" : "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData 
                            AS ( 
                          SELECT a.*, ISNULL(b.VendorName,'') as x_VendorName, 
                           ISNULL(c.QHeaderReference,'') as x_QHeaderReference, 
                           ISNULL(dbo.fn_GetInvoiceVendorBalance(a.POVId, 0),0) as x_InvoiceVendorBalance, 
                           ISNULL(dbo.fn_GetInvoiceVendorBalance(a.POVId, 1),0) as x_InvoiceVendorBalanceNB, 
                           (CASE WHEN d.POVId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) End) as x_Selected, 
                           ROW_NUMBER() OVER (ORDER BY {2} {3}) as row 
                          FROM PurchaseOrdersVendors a LEFT JOIN Vendors b ON a.VendorId = b.VendorId 
                            LEFT JOIN QuoteHeader c ON a.QHeaderId = c.QHeaderId 
                            LEFT JOIN UsersLastSelections d ON a.POVId = d.POVId and d.UserId = @userid
                          WHERE {0}) 
                         SELECT *, 
                           IsNull((select count(*) from qData),0)  as TotalRecords, 
                           ISNULL((select sum(x_InvoiceVendorBalance) from qData),0) as x_TotalBalance 
                         FROM qData 
                         WHERE {1} 
                         ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);
            da.SelectCommand.Parameters.Add("@userid", SqlDbType.NVarChar).Value = userId;

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

                IList<PurchaseOrderVendor> data = EnumExtension.ToList<PurchaseOrderVendor>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public PurchaseOrderVendor Get(int id, User currentUser, ref string msgError)
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

            PurchaseOrderVendor data = Get(id, currentUser.UserId, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public PurchaseOrderVendor Add(PurchaseOrderVendor data, User currentUser, ref string msgError)
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

            data.POVCreatedDate = DateTime.Now;
            string sql = "INSERT INTO PurchaseOrdersVendors ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "POVId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();

            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
                if (data.POVType == "PO")
                {
                    cmd.Dispose();
                    cmd.CommandText = String.Format("UPDATE QuoteHeader SET QHeaderOC='{1}' WHERE QHeaderId={0}", data.QHeaderId, data.POVPaymentNumber);
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

            PurchaseOrderVendor returnData = Get(keyGenerated, currentUser.UserId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public PurchaseOrderVendor Update(IDictionary<String, object> data, User currentUser, ref string msgError)
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
            string userId = (currentUser!=null) ? currentUser.UserId : "";
            int id = Convert.ToInt32(data["POVId"]);

            if (data.ContainsKey("x_Selected"))
            {
                handleSelected(currentUser, id, (bool)data["x_Selected"], oConn, ref msgError);
                PurchaseOrderVendor pov = Get(id, userId,oConn);
                ConnManager.CloseConn(oConn);
                return pov;
            }

            data.Add("POVModifiedDate", DateTime.Now);
            string sql = "UPDATE PurchaseOrdersVendors SET {0} WHERE POVId = @id";

            EnumExtension.SetValuesForUpdate(data, "POVId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

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

            PurchaseOrderVendor returnData = Get(id, userId,oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private PurchaseOrderVendor Get(int id, string userId, SqlConnection oConn)
        {
            string sql = "SELECT a.*, ISNULL(b.VendorName,'') as x_VendorName, " +
                         "  ISNULL(c.QHeaderReference,'') as x_QHeaderReference, " +
                         "  ISNULL(dbo.fn_GetInvoiceVendorBalance(a.POVId, 0),0) as x_InvoiceVendorBalance, " +
                         "  ISNULL(dbo.fn_GetInvoiceVendorBalance(a.POVId, 1),0) as x_InvoiceVendorBalanceNB, " +
                         "  (CASE WHEN d.POVId IS NULL THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) End) as x_Selected " +
                         "FROM PurchaseOrdersVendors a " +
                         "  LEFT JOIN Vendors b ON a.VendorId = b.VendorId " +
                         "   LEFT JOIN QuoteHeader c ON a.QHeaderId = c.QHeaderId " +
                         "   LEFT JOIN UsersLastSelections d ON a.POVId = d.POVId and d.UserId=@userid " +
                         " WHERE (a.POVId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);
            da.SelectCommand.Parameters.Add("@userid", SqlDbType.NVarChar).Value = userId;

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<PurchaseOrderVendor> data = EnumExtension.ToList<PurchaseOrderVendor>(dt);
                return data.FirstOrDefault<PurchaseOrderVendor>();
            }

            return null;
        }

        public bool Remove(PurchaseOrderVendor data, ref string msgError)
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

        private bool Remove(PurchaseOrderVendor data, SqlConnection oConn)
        {
            string sql = "DELETE FROM PurchaseOrdersVendors " +
                         " WHERE (POVId = {0})";

            sql = String.Format(sql, data.POVId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        private void handleSelected(User currentUser, int id, bool isChecked, SqlConnection oConn, ref string errMsg)
        {

            UsersLastSelected uls = null;
            uls = ULSRepository.GetPOVByUser(currentUser.UserId, id, ref errMsg);

            if (uls == null && isChecked)
            {
                uls = new UsersLastSelected();

                uls.UserId = currentUser.UserId;
                uls.POVId = id;
                uls = ULSRepository.Add(uls, ref errMsg);
            }
            else
            {
                if (uls != null && !isChecked)
                {
                    ULSRepository.Remove(uls, ref errMsg);
                }
            }
        }
        #endregion Purchase Order

        #region Purchase Order Vendors Details
        public IList<POVendorsDetail> GetListDetails(int POVId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = (POVId > 0) ? String.Format("a.POVId = {0}", POVId) : "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.POVDetailPaymentNumber";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "a.POVDetailDate";
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
                         " FROM POVendorsDetails a " +
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

                IList<POVendorsDetail> data = EnumExtension.ToList<POVendorsDetail>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public POVendorsDetail GetDetail(int id, ref string msgError)
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

            POVendorsDetail data = GetDetail(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public POVendorsDetail AddDetail(POVendorsDetail data, ref string msgError)
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

            data.POVDetailCreatedDate = DateTime.Now;
            string sql = "INSERT INTO POVendorsDetails ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "POVDetailId", ref sql);

            SqlTransaction oTX = oConn.BeginTransaction();

            SqlCommand cmd = new SqlCommand(sql, oConn, oTX);

            int keyGenerated = 0;

            try
            {
                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());
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

            POVendorsDetail returnData = GetDetail(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public POVendorsDetail UpdateDetail(POVendorsDetail data, ref string msgError)
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

            data.POVDetailModifiedDate = DateTime.Now;
            string sql = "UPDATE POVendorsDetails SET {0} WHERE POVDetailId = @id";

            EnumExtension.setUpdateValues(data, "POVDetailId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data.POVDetailId);
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

            POVendorsDetail returnData = GetDetail(data.POVDetailId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private POVendorsDetail GetDetail(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.* " +
                         "FROM POVendorsDetails a " +
                         " WHERE (a.POVDetailId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<POVendorsDetail> data = EnumExtension.ToList<POVendorsDetail>(dt);
                return data.FirstOrDefault<POVendorsDetail>();
            }

            return null;
        }

        public bool RemoveDetail(POVendorsDetail data, ref string msgError)
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

        private bool RemoveDetail(POVendorsDetail data, SqlConnection oConn)
        {
            string sql = "DELETE FROM POVendorsDetails " +
                         " WHERE (POVDetailId = @id)";

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data.POVDetailId);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }
        #endregion Purchase Order Vendors Details

    }
}