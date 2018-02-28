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
    public class DocumentsRepository : IDocumentsRepository
    {
        public IList<Document> GetList(int vendorQuoteId, int vendorId, int qHeaderId, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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
            string where = (qHeaderId > 0) ? "a.QHeaderId = @qheaderId" : "1=1";
            where += (vendorId > 0) ? " AND a.VendorId = @vendorId" : "";
            where += (vendorQuoteId > 0) ? " AND a.VendorQuoteId = @vendorQuoteId" : "";

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "DocDesc";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "DocDesc";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = @"WITH qData
                        AS
                        (
                            SELECT a.*, b.DocTypeName as x_DocTypeName, c.AttachId as x_AttachId,
                               ROW_NUMBER() OVER (ORDER BY {2} {3}) as row 
                            FROM Documents a 
                                INNER JOIN DocumentTypes b ON a.DocTypeID = b.DocTypeID
                                INNER JOIN Attachments c ON a.DocID = c.DocID
                            WHERE {0}
                        )
                        SELECT t1.*, t2.TotalRecords
                        FROM qData as t1
                        INNER JOIN (select TOP 1 row as TotalRecords from qData order by row desc)  as t2 ON 1=1
                        WHERE {1} 
                        ORDER BY row";

            sql = String.Format(sql, where, wherepage, order, direction);

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            if (qHeaderId > 0)
                da.SelectCommand.Parameters.Add("@qheaderId", SqlDbType.Int).Value = Convert.ToInt32(qHeaderId);

            if (vendorId > 0)
                da.SelectCommand.Parameters.Add("@vendorId", SqlDbType.Int).Value = Convert.ToInt32(vendorId);

            if (vendorQuoteId > 0)
                da.SelectCommand.Parameters.Add("@vendorQuoteId", SqlDbType.Int).Value = Convert.ToInt32(vendorQuoteId);

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

                IList<Document> data = EnumExtension.ToList<Document>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Document Get(int id, ref string msgError)
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

           Document data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Document Add(Document data, ref string msgError)
        {
            SqlConnection oConn = null;
            int keyGenerated = 0;
            Document returnData = null;

            try
            {
                oConn = ConnManager.OpenConn();

                data.DocCreatedDate = DateTime.Now;
                string sql = @"INSERT INTO Documents ({0}) VALUES ({1}) 
                                SELECT SCOPE_IDENTITY()";

                EnumExtension.setListValues(data, "DocID", ref sql);

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

        public Document Update(IDictionary<String, object> data, User currentUser, ref string msgError)
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
            int id = Convert.ToInt32(data["DocID"]);

            data.Add("DocModifiedDate", DateTime.Now); 
            string sql = "UPDATE Documents SET {0} WHERE DocID = @id";

            //EnumExtension.setUpdateValues(data, "DocID", ref sql);
            EnumExtension.SetValuesForUpdate(data, "DocID", ref sql);

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

            Document returnData = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Document Get(int id, SqlConnection oConn)
        {
            string sql = @"SELECT a.*, b.DocTypeName as x_DocTypeName, c.AttachId as x_AttachId 
                        FROM Documents a 
                            INNER JOIN DocumentTypes b on a.DocTypeID = b.DocTypeID
                            LEFT JOIN Attachments c on a.DocID = c.DocID
                        WHERE (a.DocID = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Document> data = EnumExtension.ToList<Document>(dt);
                return data.FirstOrDefault<Document>();
            }

            return null;
        }

        public bool Remove(Document data, ref string msgError)
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

        private bool Remove(Document data, SqlConnection oConn)
        {
            string sql = "SELECT AttachName FROM Attachments WHERE DocId = @DocID ";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@DocID", SqlDbType.Int).Value = data.DocID;

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

            sql = "DELETE FROM Documents WHERE (DocID = @id)";
            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data.DocID);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}