﻿using IAMTradingWA.Models;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace IAMTradingWA.Controllers
{
    [AllowAnonymous]
    public class AuthController : ApiController
    {
        static readonly IUsersRepository userRepository = new UsersRepository();

        
        public HttpResponseMessage PostAuth(JObject jsonRequest)
        {

            var userName = (string)jsonRequest["data"]["UserId"];
            var userPassword = (string)jsonRequest["data"]["UserPassword"];

            var userLogged = userRepository.ValidLogon(userName, userPassword);


            if (userLogged == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No Existe");
            }

            string token = userRepository.GenToken(userLogged);

            // Limpiamos el password para no devolverlo como objeto
            userLogged.UserPassword = "";

            object json = new
            {
                data = userLogged,
                security = token
            };

            return Request.CreateResponse(HttpStatusCode.OK, json);
        }
    }
}