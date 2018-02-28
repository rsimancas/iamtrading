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
    public class ImagesRepository : IImagesRepository
    {
        public IList<Img> GetList(int itemId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            string wherepage = (page != 0) ? String.Format("row>{0} and row<={1} ", start, limit) : "row>0";
            string where = (itemId > 0) ? "a.ItemId = @itemId" : "a.ItemId is not null";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.AttachName";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "ImageDesc";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData
                        AS
                        (
                            SELECT a.AttachId,a.ItemId, a.AttachName as ImageDesc, a.AttachFilePath as ImagePath, a.AttachContentType as ImageContentType
                            FROM Attachments a
                            WHERE {0}
                        )
                        select *
                        FROM
                        (
	                        SELECT t1.*, t2.TotalRecords,
		                          ROW_NUMBER() OVER (ORDER BY {2} {3}) as row 
	                        FROM qData t1 INNER JOIN (select count(*) as TotalRecords from qData) as t2 ON 1=1
                        ) a
                        WHERE {1}       
                        ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            if (itemId > 0)
                da.SelectCommand.Parameters.Add("@itemId", SqlDbType.Int).Value = Convert.ToInt32(itemId);

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

                IList<Img> data = EnumExtension.ToList<Img>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Img Get(int id, ref string msgError)
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

           Img data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Img Add(Img data, ref string msgError)
        {
            SqlConnection oConn = null;
            int keyGenerated = 0;
            Img returnData = null;

            try
            {
                oConn = ConnManager.OpenConn();

                string sql = @"INSERT INTO Attachments (AttachName,AttachContentType,AttachFilePath) VALUES ({1}) 
                                SELECT SCOPE_IDENTITY()";

                //EnumExtension.setListValues(data, "DocID", ref sql);

                SqlCommand cmd = new SqlCommand(sql, oConn);

                keyGenerated = Convert.ToInt32(cmd.ExecuteScalar());

                returnData = Get(keyGenerated, oConn);
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                msgError = ex.Message;
                return null;
            }

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public Img Update(IDictionary<String, object> data, User currentUser, ref string msgError)
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
            string userId = (currentUser != null) ? currentUser.UserId : "";
            int id = Convert.ToInt32(data["AttachId"]);

            string sql = "UPDATE Attachments SET AttachName = @ImageDesc WHERE AttachId = @id";

            SqlCommand cmd = new SqlCommand(sql, oConn);

            cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
            cmd.Parameters.Add("@ImageDesc", SqlDbType.NVarChar).Value = data["ImageDesc"];

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

            Img returnData = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Img Get(int id, SqlConnection oConn)
        {
            string sql = @" SELECT a.AttachId, a.ItemId, a.AttachName as ImageDesc, a.AttachFilePath as ImagePath, a.AttachContentType as ImageContentType
                            FROM Attachments a
                            WHERE (a.AttachId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Img> data = EnumExtension.ToList<Img>(dt);
                return data.FirstOrDefault<Img>();
            }

            return null;
        }

        public bool Remove(Img data, ref string msgError)
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

        private bool Remove(Img data, SqlConnection oConn)
        {
            string sql = "SELECT AttachFilePath FROM Attachments WHERE AttachId = @id ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = data.AttachId;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                return false;
            }

            DataTable dt;
            dt = ds.Tables[0];
            foreach (DataRow row in dt.Rows)
            {
                string file = row[0].ToString();

                File.Delete(file);
            }

            sql = "DELETE FROM Attachments WHERE (AttachId = @id)";
            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data.AttachId);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}