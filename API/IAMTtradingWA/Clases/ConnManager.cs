namespace Utilidades
{
    using System;
    using System.Configuration;
    using System.Data;
    using System.Data.SqlClient;
    using System.Reflection;

    public static class ConnManager
    {
        public static DateTime DateOnServer;

        public static SqlConnection OpenConn()
        {
            SqlConnection oConn = new SqlConnection(ConnManager.cStringConnect);

            try
            {
                oConn.Open();

                SqlCommand cmd = oConn.CreateCommand();
                cmd.CommandText = "SET IMPLICIT_TRANSACTIONS OFF\n" +
                                  "SET LOCK_TIMEOUT -1\n" +
                                  //"SET ANSI_WARNINGS OFF\n" +
                                  "SET DATEFIRST 1\n"; // Lunes Primer Dia de La Semana

                cmd.ExecuteNonQuery();
                cmd.Dispose();
                //LogManager.Write("OpenConn");
            }
            catch (SqlException ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = ConnManager." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return null;
            }

            return oConn;
        }

        public static bool CloseConn(SqlConnection oConn)
        {
            if (oConn != null)
            {
                if (oConn.State == ConnectionState.Open)
                {
                    try
                    {
                        oConn.Close();
                        oConn.Dispose();
                        //LogManager.Write("CloseConn");
                    }
                    catch
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public static string GetPrimaryKey(string tabla, SqlConnection oConn)
        {
            SqlCommand cmd;
            string strcmd = string.Format("SELECT u.COLUMN_NAME, c.CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS c INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS u ON c.CONSTRAINT_NAME = u.CONSTRAINT_NAME where u.TABLE_NAME = '{0}' AND c.TABLE_NAME = '{0}' and c.CONSTRAINT_TYPE = 'PRIMARY KEY'", tabla);
            cmd = new SqlCommand(strcmd, oConn);

            string pkcol = "";
            try
            {
                pkcol = Convert.ToString(cmd.ExecuteScalar());
            }
            catch (SqlException ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = ConnManager." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return ex.Message;
            }
            return pkcol;
        }

        public static string GetRowGUID()
        {
            return Guid.NewGuid().ToString().ToUpper().Substring(2, 20);
        }

        public static DateTime GetServerDate()
        {

            SqlConnection oConn = ConnManager.OpenConn();

            SqlCommand cmd = new SqlCommand("SELECT GETDATE()", oConn);

            var dateServer = DateTime.Now;
            try
            {
                dateServer = (DateTime)cmd.ExecuteScalar();
            }
            catch (Exception)
            {
                dateServer = DateTime.Now;
            }

            ConnManager.CloseConn(oConn);

            DateOnServer = dateServer;

            return dateServer;
        }

        public static string cStringConnect
        {
            get
            {
                string sc = ConfigurationManager.ConnectionStrings["IAMTradingConn"].ConnectionString;
                return sc;
            }
        }
    }
}

