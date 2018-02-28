using IAMTradingWA.Models;
using System;
using System.Net.Http;
using Utilidades;

namespace IAMTradingWA.Users
{
    public static class UsersManager
    {
        static readonly IUsersRepository usrRepository = new UsersRepository();

        public static User GetCurrentUser(HttpRequestMessage request)
        {
            string token;

            try
            {
                string[] strValues = (string[])request.Headers.GetValues("Authorization-Token");
                token = strValues[0];
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + ex.Message);
                return null;
            }

            try
            {
                string[] split = token.Split(',');

                string usrName = Utils.Decrypt(split[0]);
                string usrPwd = Utils.Decrypt(split[1]);

                var userLogged = usrRepository.ValidLogon(usrName, usrPwd);

                if (userLogged == null)
                {
                    throw new Exception("Invalid User");
                };

                return userLogged;
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + ex.Message);
                return null;
            }
        }
    }
}
