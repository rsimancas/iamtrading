using System;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public class ResourcesRepository : IResourcesRepository
    {
        public Nullable<DateTime> GetPreviousDate(int daysAgo, ref string msgError)
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

            Nullable<DateTime> previousDate = GetPreviousDate(daysAgo, oConn);

            ConnManager.CloseConn(oConn);

            return previousDate;
        }

        private Nullable<DateTime> GetPreviousDate(int daysAgo, SqlConnection oConn)
        {
            string sql = "SELECT CAST(dbo.fPreviousWorkingDay(getdate()) AS DATE) as previousDate";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                Nullable<DateTime> data = (Nullable<DateTime>)dt.Rows[0][0];
                return data;
            }

            return null;
        }

    }
}