using Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public class PaymentVendorsRepository : IPaymentVendorsRepository
    {
        static readonly IAttachmentsRepository repAtt = new AttachmentsRepository();

        public IList<PaymentVendor> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            // Handle Order
            string order = "a.PayVendorDate";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "SELECT a.*, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from PaymentVendors a WHERE {0}),0)  as TotalRecords   " +
                         " FROM PaymentVendors a WHERE {0}) a  " +
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
                IList<PaymentVendor> data = EnumExtension.ToList<PaymentVendor>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public PaymentVendor Get(int id, ref string msgError)
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

            PaymentVendor data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public PaymentVendor Add(PaymentVendor data, ref string msgError)
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

            string sql = "INSERT INTO PaymentVendors ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "PayVendorId", ref sql);

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

            PaymentVendor returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public PaymentVendor Update(PaymentVendor data, ref string msgError)
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

            string sql = "UPDATE PaymentVendors SET {0} WHERE PayVendorId = @id";

            EnumExtension.setUpdateValues(data, "PayVendorId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.PayVendorId;

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

            PaymentVendor returnData = Get(data.PayVendorId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private PaymentVendor Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.* FROM PaymentVendors a " +
                         " WHERE (a.PayVendorId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<PaymentVendor> data = EnumExtension.ToList<PaymentVendor>(dt);
                return data.FirstOrDefault<PaymentVendor>();
            }

            return null;
        }

        public bool Remove(PaymentVendor data, ref string msgError)
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

        private bool Remove(PaymentVendor data, SqlConnection oConn)
        {
            int totalFiles  = 0;
            string msg = "";

            IList<Attached> files = repAtt.GetList(false, data.PayVendorCreatedBy, ref totalFiles, ref msg, data.PayVendorId);

            if (files != null)
            {
                foreach (var file in files)
                {
                    File.Delete(file.AttachFilePath);
                }
            }

            string sql = "DELETE FROM PaymentVendors " +
                         " WHERE (PayVendorId = @id)";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.PayVendorId;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}