namespace Utilidades
{
    using System;
    using System.IO;
    using System.Web;

    public static class LogManager
    {
        //AppDomain.CurrentDomain.BaseDirectory

        //public static string _path = Path.Combine(Path.GetTempPath(), "logs");
        public static string _path = Path.Combine(HttpContext.Current.Request.MapPath("~/App_Data/Logs/"));
        public static string _filename = Path.Combine(_path, "IAMTrading" + DateTime.Now.ToString("yyyyMMdd HH") + ".txt");
        public static DateTime _datelog = DateTime.Now;

        public static void Write(string text)
        {
            if ( _datelog.ToString("yyyyMMdd HH") != DateTime.Now.ToString("yyyyMMdd HH") ) 
            {
                _filename = Path.Combine(_path, "IAMTrading" + DateTime.Now.ToString("yyyyMMdd HH") + ".txt");
            }

            try
            {
                while (!Directory.Exists(_path))
                {
                    Directory.CreateDirectory(_path);
                }

                while (!File.Exists(_filename))
                {
                    StreamWriter ws = new StreamWriter(_filename);
                    ws.WriteLine("INICIO: " + DateTime.Now.ToString());
                    ws.Close();
                }
            }
            catch
            {
               // throw
            }

            //ReplicacionService.WriteToLog(text);
            StreamWriter SW = File.AppendText(_filename);
            SW.WriteLine(DateTime.Now.ToLongTimeString() + ": " + text);
            SW.Close();
        }
    }
}

