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
    public class UsersRepository : IUsersRepository
    {
        //DBContext dbcontext;
        public UsersRepository()
        {
            //dbcontext = new DBContext();
        }

        public IList<User> GetAll(int page, int start, int limit, ref int totalRecords)
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

            string where = (page != 0) ? " WHERE row>@start and row<=@limit " : "";

            string sql = "SELECT * FROM (SELECT *, " +
                         "  ROW_NUMBER() OVER (ORDER BY UserName) as row,  " +
                         "  IsNull((select count(*) from Users),0)  as TotalRecords   " +
                         " FROM Users) a  " +
                         where +
                         " ORDER BY ROW";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            if (page != 0)
            {
                da.SelectCommand.Parameters.Add("@start", SqlDbType.Int).Value = Convert.ToInt32(start);
                da.SelectCommand.Parameters.Add("@limit", SqlDbType.Int).Value = Convert.ToInt32(limit);
            };

            DataSet ds = new DataSet();

            da.Fill(ds);

            ConnManager.CloseConn(oConn);

            DataTable dt;
            dt = ds.Tables[0];

            totalRecords = (int)dt.Rows[0]["TotalRecords"];

            IList<User> data = dt.AsEnumerable()
                          .Select(row => new User
                          {
                              UserFirstName = Convert.ToString(row["UserName"]),
                              UserFullName = Convert.ToString(row["UserFullName"])
                          }).ToList<User>();

            return data;
        }

        public User Get(string id)
        {
            //dbcontext.Configuration.ProxyCreationEnabled = false;
            //var languages = dbcontext.User.Where(x => x.UserCode == id);
            //if (languages.Count() > 0)
            //{
            //    return languages.Single();
            //}
            //else
            //{
            return null;
            //}
        }

        public User Add(User User)
        {
            //dbcontext.Configuration.ProxyCreationEnabled = false;
            //if (User == null)
            //{
            //    throw new ArgumentNullException("item");
            //}
            //dbcontext.User.Add(User);
            //dbcontext.SaveChanges();
            return User;
        }

        public void Remove(User usuario)
        {
            //User User = Get(id);
            //if (User != null)
            //{
            //    dbcontext.User.Remove(User);
            //    dbcontext.SaveChanges();
            //}
        }

        public bool Update(User User)
        {
            //if (User == null)
            //{
            //    throw new ArgumentNullException("User");
            //}

            //User UserInDB = Get(User.UserCode);

            //if (UserInDB == null)
            //{
            //    return false;
            //}

            //dbcontext.User.Remove(UserInDB);
            //dbcontext.SaveChanges();

            //dbcontext.User.Add(User);
            //dbcontext.SaveChanges();

            return true;
        }

        public User ValidLogon(string userName, string userPassword)
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


            string sql = "select * "  + 
                         " from Users where UserId=@uid and UserPassword=@pwd";

            SqlDataAdapter da = new SqlDataAdapter(sql, oConn);

            da.SelectCommand.Parameters.Add("@uid", SqlDbType.NVarChar, 100).Value = userName;
            da.SelectCommand.Parameters.Add("@pwd", SqlDbType.NVarChar,50).Value = userPassword;

            DataSet ds = new DataSet();

            try
            {
                da.Fill(ds);
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = " + this.GetType().FullName + "." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            }
            finally
            {
                ConnManager.CloseConn(oConn);
            }

            DataTable dt;
            dt = ds.Tables[0];


            IList<User> data = EnumExtension.ToList<User>(dt);
            
            if (data.Count != 0)
                return data.FirstOrDefault<User>();

            return null;
        }

        public string GenToken(User usr)
        {

            string id = Utils.Encrypt(usr.UserId),
                   password = Utils.Encrypt(usr.UserPassword);

            return String.Format("{0},{1}", id, password);
        }
    }
}