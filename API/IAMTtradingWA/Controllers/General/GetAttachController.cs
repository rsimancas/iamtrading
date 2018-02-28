using IAMTradingWA.Models;
using System;
using System.Collections.Specialized;
using System.IO;
using System.Web.Mvc;
using Utilidades;

namespace IAMTradingWA.Controllers
{
    //[TokenValidation]
    public class GetAttachController : Controller
    {
        static readonly IAttachmentsRepository repository = new AttachmentsRepository();
        static NameValueCollection queryValues = null;

        public ActionResult Index()
        {
            queryValues = Request.QueryString;

            int attachId = Convert.ToInt32(queryValues["id"]);
            string errMsg = "";
            string contentType = "";
            string filename = "";

            if (attachId != 0)
            {
                filename = repository.GetFile(attachId, ref contentType, ref errMsg);
            }

            return File(filename, contentType);
        }
    }
}