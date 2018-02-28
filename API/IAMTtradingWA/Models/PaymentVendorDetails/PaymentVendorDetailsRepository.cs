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
    public class PaymentVendorDetailsRepository : IPaymentVendorDetailsRepository
    {
        public IList<PaymentVendorDetail> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg, int PayVendorId)
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
            string where = (PayVendorId > 0) ? string.Format("a.PayVendorId = {0}", PayVendorId) :"1=1";

            // Handle Order
            string order = "a.PayVendorDetailId";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"SELECT * FROM ( 
                            SELECT a.*, b.PayModeDescription as x_PayModeDescription, 
                                    RTRIM(ISNULL(d.BankName,'')) + ', ' + RTRIM(c.AccountReference) + ', ***' + RIGHT(ISNULL(c.AccountNumber,''),4) as BankAccount,
                            ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  
                            IsNull((select count(*) from PaymentVendorDetails a WHERE {0}),0)  as TotalRecords   
                            FROM PaymentVendorDetails a INNER JOIN PaymentModes b ON a.PayModeID = b.PayModeID
                                LEFT JOIN BankAccounts c ON a.AccountID = c.AccountID
                                LEFT JOIN BankingInstitutions d ON c.BankID = d.BankID
                            WHERE {0}
                          ) a  
                          WHERE {1} 
                          ORDER BY row";

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

                IList<PaymentVendorDetail> data = EnumExtension.ToList<PaymentVendorDetail>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public PaymentVendorDetail Get(int id, ref string msgError)
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

            PaymentVendorDetail data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public PaymentVendorDetail Add(PaymentVendorDetail data, ref string msgError)
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

            string sql = "INSERT INTO PaymentVendorDetails ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "PayVendorDetailId", ref sql);

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

            PaymentVendorDetail returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public PaymentVendorDetail Update(PaymentVendorDetail data, ref string msgError)
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

            string sql = "UPDATE PaymentVendorDetails SET {0} WHERE PayVendorDetailId = @id";

            EnumExtension.setUpdateValues(data, "PayVendorDetailId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.PayVendorDetailId;

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

            PaymentVendorDetail returnData = Get(data.PayVendorDetailId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private PaymentVendorDetail Get(int id, SqlConnection oConn)
        {
            string sql = @"SELECT a.*, b.PayModeDescription as x_PayModeDescription
                          FROM PaymentVendorDetails a INNER JOIN PaymentModes b ON a.PayModeID = b.PayModeID
                          WHERE (a.PayVendorDetailId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<PaymentVendorDetail> data = EnumExtension.ToList<PaymentVendorDetail>(dt);
                return data.FirstOrDefault<PaymentVendorDetail>();
            }

            return null;
        }

        public bool Remove(PaymentVendorDetail data, ref string msgError)
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

        private bool Remove(PaymentVendorDetail data, SqlConnection oConn)
        {
            string sql = "DELETE FROM PaymentVendorDetails " +
                         " WHERE (PayVendorDetailId = @id)";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.PayVendorDetailId;

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}