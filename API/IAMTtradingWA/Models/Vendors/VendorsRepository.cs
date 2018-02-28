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
    public class VendorsRepository : IVendorsRepository
    {
        //private IAMTradingDataContext context { get; set; }

        static readonly IPaymentVendorsRepository repPayHead = new PaymentVendorsRepository();
        static readonly IPaymentVendorDetailsRepository repPayDetail = new PaymentVendorDetailsRepository();
        static readonly IPurchaseOrdersVendorsRepository repPOV = new PurchaseOrdersVendorsRepository();
        static readonly IAttachmentsRepository repAtt = new AttachmentsRepository();

        public VendorsRepository()
        {
            //context = new IAMTradingDataContext();
        }

        public IList<Vendor> GetList(bool onlyWithBalance, string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errMsg)
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

            string where = (onlyWithBalance) ? "dbo.fn_GetVendorBalance(a.VendorId, 0) <> 0 " : "1=1"; ;

            if (!string.IsNullOrEmpty(query))
            {
                string fieldName = "a.VendorName+' '+ISNULL(b.BrokerName,'')";
                where += (!string.IsNullOrEmpty(where) ? " and " : "") +
                    EnumExtension.generateLikeWhere(query, fieldName);
            }

            // Handle Order
            string order = "VendorName";
            string direction = "ASC";

            if (!string.IsNullOrWhiteSpace(sort.property))
            {
                order = sort.property;
                direction = sort.direction;

                //order = (sort.property == "x_VendorBalance") ? "dbo.fn_GetVendorBalance(a.VendorId, 0)" : order;
            }

            string sql = @"WITH qData 
                            AS
                            (
	                            SELECT a.*, dbo.fn_GetVendorBalance(a.VendorId, 0) as x_VendorBalance,
                                    b.BrokerName
	                            FROM Vendors a LEFT JOIN Brokers b ON a.BrokerId = b.BrokerId
	                            WHERE {0}
                            )
                            SELECT * FROM ( 
	                            SELECT a.*, ROW_NUMBER() OVER (ORDER BY {2} {3}) as row,  
	                            b.TotalRecords, b.x_GrandTotalBalance
	                            FROM qData a LEFT OUTER JOIN (select count(*) as TotalRecords,sum(x_VendorBalance) as x_GrandTotalBalance from qData) as b ON 1=1
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

                IList<Vendor> data = EnumExtension.ToList<Vendor>(dt);
                totalRecords = Convert.ToInt32(dt.Rows[0]["TotalRecords"]);
                return data;
            }
            else
            {
                return null;
            }
        }

        public Vendor Get(int id, ref string msgError)
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

            Vendor data = Get(id, oConn);

            ConnManager.CloseConn(oConn);

            return data;
        }

        public Vendor Add(Vendor data, ref string msgError)
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

            data.VendorCreatedDate = DateTime.Now;
            string sql = "INSERT INTO Vendors ({0}) VALUES ({1}) " +
                "SELECT SCOPE_IDENTITY()";

            EnumExtension.setListValues(data, "VendorId", ref sql);

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

            Vendor returnData = Get(keyGenerated, oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        public Vendor Update(IDictionary<String, object> data, ref string msgError)
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

            data.Add("VendorModifiedDate", DateTime.Now);

            string sql = "UPDATE Vendors SET {0} WHERE VendorId = @id";

            EnumExtension.SetValuesForUpdate(data, "VendorId", ref sql);

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(data["VendorId"]);

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

            Vendor returnData = Get(Convert.ToInt32(data["VendorId"]), oConn);

            ConnManager.CloseConn(oConn);

            return returnData;
        }

        private Vendor Get(int id, SqlConnection oConn)
        {
            string sql = @"SELECT a.*, dbo.fn_GetVendorBalance(a.VendorId, 0) as x_VendorBalance,
                                b.BrokerName FROM Vendors a  LEFT JOIN Brokers b ON a.BrokerId = b.BrokerId 
                            WHERE (a.VendorId = @id)";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            DataSet ds = new DataSet();

            da.Fill(ds);

            DataTable dt;
            dt = ds.Tables[0];

            if (dt.Rows.Count > 0)
            {
                IList<Vendor> data = EnumExtension.ToList<Vendor>(dt);
                return data.FirstOrDefault<Vendor>();
            }

            return null;
        }

        public bool Remove(int id, ref string msgError)
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
                result = Remove(id, oConn);
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

        private bool Remove(int id, SqlConnection oConn)
        {
            string sql = "DELETE FROM Vendors " +
                         " WHERE (VendorId = @id)";

            SqlCommand cmd = new SqlCommand(sql, oConn);
            cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(id);

            int number = Convert.ToInt32(cmd.ExecuteNonQuery());

            if (number > 0) return true;

            return false;
        }

        public void CleanUserVendorSelections(int VendorId, string UserId)
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
            }

            try
            {
                string sql = "DELETE FROM UsersLastSelections " +
                         " WHERE UserId = @uid AND POVId in (SELECT POVId FROM PurchaseOrdersVendors WHERE VendorId = @id)";

                SqlCommand cmd = new SqlCommand(sql, oConn);
                cmd.Parameters.Add("@id", SqlDbType.Int).Value = Convert.ToInt32(VendorId);
                cmd.Parameters.Add("@uid", SqlDbType.VarChar).Value = UserId;

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                ConnManager.CloseConn(oConn);
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }

            ConnManager.CloseConn(oConn);
        }

        public bool Pay(int VendorId, string UserId, Payment Paid, ref string msg)
        {
            decimal amount = 0, amountNB = 0, currencyRate = 0;
            string reference = "";
            PaymentVendor payHeader = new PaymentVendor();
            payHeader.PayVendorCreatedBy = UserId;
            payHeader.PayVendorCreatedDate = DateTime.Now;

            // Add into database pay Header
            payHeader = repPayHead.Add(payHeader, ref msg);

            //Insert into database details
            foreach (var pov in Paid.PaidDetail)
            {
                PaymentVendorDetail payDetail = new PaymentVendorDetail();
                payDetail.PayModeID = pov.PayModeID;
                payDetail.PayVendorId = payHeader.PayVendorId;
                payDetail.PayVendorDetailAmount = pov.PayVendorDetailAmount;
                payDetail.PayVendorDetailAmountNB = pov.PayVendorDetailAmountNB;
                payDetail.PayVendorDetailCurrencyRate = pov.PayVendorDetailCurrencyRate;
                payDetail.PayVendorDetailReference = pov.PayVendorDetailReference;
                payDetail.AccountID = pov.AccountID;
                payDetail.PayVendorDetailDate = pov.PayVendorDetailDate;
                payDetail.PayVendorDetailComments = pov.PayVendorDetailComments;

                amount += pov.PayVendorDetailAmount;
                amountNB += pov.PayVendorDetailAmountNB;
                currencyRate = pov.PayVendorDetailCurrencyRate;
                reference += "/" + pov.PayVendorDetailReference;

                payDetail = repPayDetail.Add(payDetail, ref msg);
            }

            // insert details to pay
            decimal thisPaid = 0, thisPaidNB = 0;
            foreach (var pov in Paid.POVList)
            {
                thisPaid = pov.x_InvoiceVendorBalance.GetValueOrDefault();
                thisPaidNB = pov.x_InvoiceVendorBalanceNB.GetValueOrDefault();

                POVendorsDetail povDetail = new POVendorsDetail();
                povDetail.POVDetailAmount = -thisPaid;
                povDetail.POVDetailAmountNB = -thisPaidNB;
                povDetail.POVDetailCreatedBy = UserId;
                povDetail.POVDetailCreatedDate = DateTime.Now;
                povDetail.POVDetailCurrencyRate = currencyRate;
                povDetail.POVDetailDate = DateTime.Now;
                povDetail.POVDetailPaymentNumber = !string.IsNullOrEmpty(reference) ? reference.Substring(1) : reference;
                povDetail.POVId = pov.POVId;
                povDetail.POVDetailType = "PB";
                povDetail.PayVendorId = payHeader.PayVendorId;

                povDetail = repPOV.AddDetail(povDetail, ref msg);
            }

            foreach (var file in Paid.Files)
            {
                IDictionary<string, object> data = new Dictionary<string, object>();
                data["AttachId"] = file.AttachId;
                data["AttachDirty"] = false;
                data["PayVendorId"] = payHeader.PayVendorId;
                repAtt.Update(data, UserId, ref msg);
            }
            //msg = String.Format("{0:#,###.00} and {1:#,###.00}", amount, amountNB);
            return true;
        }

        public bool ReversePaid(int PayVendorId, string UserId, ref string msg)
        {
            PaymentVendor payHead = repPayHead.Get(PayVendorId, ref msg);

            return repPayHead.Remove(payHead, ref msg);
        }
    }
}