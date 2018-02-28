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
    public class ItemsRepository : IItemsRepository
    {
        public IList<Item> GetList(string query, Sort sort, Filter filter, String[] queryBy, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            #region Filtros
            if (!string.IsNullOrWhiteSpace(filter.property))
            {
                where += String.Format(" and a.{0} = {1}", filter.property, filter.value);
            }
            #endregion Filtros

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.ItemName+b.VendorName+a.ItemGYCode";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            #region Query By Settings
            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "";

                if (queryBy.Length == 0)
                {
                    fieldName = "a.ItemName+b.VendorName+ISNULL(a.ItemGYCode,'')";
                }
                else
                {
                    foreach (string field in queryBy)
                    {
                        switch (field)
                        {
                            case "ItemName":
                                fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                                fieldName += "a.ItemName";
                                break;
                            case "VendorName":
                                fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                                fieldName += "b.VendorNAme";
                                break;
                            case "ItemGYCode":
                                fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                                fieldName += "a.ItemGYCode";
                                break;
                            default:
                                fieldName += (!String.IsNullOrWhiteSpace(fieldName)) ? " + " : "";
                                fieldName += field;
                                break;
                        }
                    }
                }

                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                        EnumExtension.generateLikeWhere(query, fieldName);

            }
            #endregion Query By Settings

            // Handle Order
            string order = "a.ItemName";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;
            }

            string sql = "SELECT * FROM ( " +
                         "SELECT a.*,b.VendorName as x_VendorName, " +
                         "  ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  " +
                         "  IsNull((select count(*) from Items a INNER JOIN Vendors b ON a.VendorId=b.VendorId WHERE {0}),0)  as TotalRecords   " +
                         " FROM Items a INNER JOIN Vendors b ON a.VendorId=b.VendorId WHERE {0}) a  " +
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

                IList<Item> data = EnumExtension.ToList<Item>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Item Get(int id, ref string msgError)
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

            Item data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Item Add(Item data, ref string msgError)
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

            data.ItemCreatedDate = DateTime.Now;
            string sql = "INSERT INTO Items ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "ItemId", ref sql);

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

            Item returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public Item Update(Item data, ref string msgError)
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

            data.ItemModifiedDate = DateTime.Now;
            string sql = "UPDATE Items SET {0} WHERE ItemId = " + data.ItemId.ToString();

            EnumExtension.setUpdateValues(data, "ItemId", ref sql);

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

            Item returnData = Get(data.ItemId, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Item Get(int id, SqlConnection oConn)
        {
            string sql = "SELECT a.*,b.VendorName as x_VendorName FROM Items a INNER JOIN Vendors b ON a.VendorId=b.VendorId" +
                         " WHERE (a.ItemId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Item> data = EnumExtension.ToList<Item>(dt);
                return data.FirstOrDefault<Item>();
            }

            return null;
        }

        public bool Remove(Item data, ref string msgError)
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

        private bool Remove(Item data, SqlConnection oConn)
        {
            string sql = "DELETE FROM Items " +
                         " WHERE (ItemId = {0})";

            sql = String.Format(sql, data.ItemId);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

    }
}