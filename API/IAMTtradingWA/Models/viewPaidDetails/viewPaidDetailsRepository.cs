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
    public class viewPaidDetailsRepository : IviewPaidDetailsRepository
    {
        public IList<viewPaidDetail> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg, int PayVendorId)
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
            string where = (PayVendorId > 0) ? string.Format("a.PayVendorId = {0}", PayVendorId) : "1=1";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.InvoiceNum";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "DetailId";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData AS ( 
                            SELECT a.*
                            FROM viewPaidDetails a 
                            WHERE {0}
                          )
                          SELECT * FROM (
                            SELECT *, 
                            ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  
                            IsNull((select count(*) from qData),0)  as TotalRecords
                            FROM qData
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

                IList<viewPaidDetail> data = EnumExtension.ToList<viewPaidDetail>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public viewPaidDetail Get(int id, ref string msgError)
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

            viewPaidDetail data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        private viewPaidDetail Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.* FROM viewPaidDetails a " +
                         " WHERE (a.DetailId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<viewPaidDetail> data = EnumExtension.ToList<viewPaidDetail>(dt);
                return data.FirstOrDefault<viewPaidDetail>();
            }

            return null;
        }
    }
}