using IAMTradingWA.Models;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Utilidades;


namespace IAMTradingWA.Controllers
{
    //[TokenValidation]
    public class AttachImageOldController : ApiController
    {
        static readonly IAttachmentsRepository repository = new AttachmentsRepository();

        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var nvc = httpRequest.Form;

            try
            {

                int qheaderId = Convert.ToInt32(nvc["QHeaderId"]);
                int docTypeID = Convert.ToInt32(nvc["DocTypeID"]);
                string fileName = nvc["FileName"];
                string currentUser = nvc["CurrentUser"];
                string imagen = nvc["Imagen"];

                string[] strSplit = imagen.Split(',');

                imagen = strSplit[1];
                imagen = imagen.Replace("data:image/jpeg;base64,", "");
                imagen = imagen.Replace("data:image/png;base64,", "");
                imagen = imagen.Replace("data:image/jpg;base64,", "");
                imagen = imagen.Replace("data:image/gif;base64,", "");
                imagen = imagen.Replace(" ", "+");
                imagen = imagen.Replace('-', '+');
                imagen = imagen.Replace('_', '/');

                string filename = fileName + ".jpg";
                string ext = Path.GetExtension(filename).ToLower();
                //string contenttype = "image/jpg";

                byte[] encodedByte = Convert.FromBase64String(imagen);

                //string errMsg = "";

                //repository.InsertAttachedDocument(docTypeID, currentUser, qheaderId, filename, contenttype, encodedByte, ref errMsg);

                object json = new
                {
                    success = true,
                    message = "Successfull"
                };

                result = Request.CreateResponse(HttpStatusCode.Created, json);

            }
            catch (Exception ex)
            {
                LogManager.Write(ex.Message);
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            return result;

        }
    }
}
