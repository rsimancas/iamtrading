using IAMTradingWA.Models;
using Microsoft.WindowsAPICodePack.Shell;
using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Utilidades;


namespace IAMTradingWA.Controllers
{
    //[TokenValidation]
    public class AttachController : ApiController
    {
        static readonly IAttachmentsRepository repository = new AttachmentsRepository();

        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            var nvc = httpRequest.Form;

            try
            {
                HttpPostedFile file = httpRequest.Files[0];
                string fileName = file.FileName;
                bool dirty = false;
                bool.TryParse(nvc["Dirty"], out dirty);
                string currentUser = nvc["CurrentUser"];

                string dirPath = HttpContext.Current.Request.MapPath("~/App_Data/UploadedFiles/");
                if (!Directory.Exists(dirPath))
                {
                    Directory.CreateDirectory(dirPath);
                }

                string tempFile = Guid.NewGuid().ToString().Replace("{","").Replace("}","");
                
                tempFile = Path.ChangeExtension(tempFile, Path.GetExtension(file.FileName));

                while (File.Exists(tempFile))
                {
                    tempFile = Path.ChangeExtension(Path.GetRandomFileName(), Path.GetExtension(file.FileName));
                }

                string ToSaveFileTo = HttpContext.Current.Request.MapPath("~/App_Data/UploadedFiles/"+tempFile);

                file.SaveAs(ToSaveFileTo);

                tempFile = dirPath + tempFile;

                string contenttype = file.ContentType;

                string errMsg = "";

                repository.InsertAttach(tempFile, currentUser, dirty, fileName, contenttype, ref errMsg);

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

        public static byte[] ReadFully(Stream input)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                input.CopyTo(ms);
                return ms.ToArray();
            }
        }

        
    }
}
