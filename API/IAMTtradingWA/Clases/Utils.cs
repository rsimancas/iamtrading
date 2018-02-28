namespace Utilidades
{
    using IAMTradingWA.Models;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Data;
    using System.Data.OleDb;
    using System.Data.Sql;
    using System.Globalization;
    using System.IO;
    using System.Net;
    using System.Runtime.InteropServices;
    using System.Security.Cryptography;
    using System.Text;
    using System.Web;

    public static class Utils
    {
        public static int MF_BYPOSITION = 0x400;
        public static int NETWORK_ALIVE_AOL = 4;
        public static int NETWORK_ALIVE_LAN = 1;
        public static int NETWORK_ALIVE_WAN = 2;
        public static string Nombre = "";

        public static string ByteArrayToStr(byte[] dBytes)
        {
            ASCIIEncoding enc = new ASCIIEncoding();
            return enc.GetString(dBytes);
        }

        [DllImport("User32")]
        public static extern int GetMenuItemCount(IntPtr hWnd);
        [DllImport("User32")]
        public static extern IntPtr GetSystemMenu(IntPtr hWnd, bool bRevert);
        [DllImport("sensapi.dll")]
        public static extern bool IsDestinationReachable(string dest, IntPtr ptr);
        [DllImport("sensapi.dll")]
        public static extern bool IsNetworkAlive(ref int flags);
        public static DataTable ObtenerServerInfo()
        {
            return SqlDataSourceEnumerator.Instance.GetDataSources();
        }

        [DllImport("User32")]
        public static extern int RemoveMenu(IntPtr hMenu, int nPosition, int wFlags);
        public static void SetUnabledCloseButton(IntPtr hWnd)
        {
            IntPtr hMenu = GetSystemMenu(hWnd, false);
            int menuItemCount = GetMenuItemCount(hMenu);
            RemoveMenu(hMenu, menuItemCount - 1, MF_BYPOSITION);
        }

        public static byte[] StrToByteArray(string str)
        {
            ASCIIEncoding encoding = new ASCIIEncoding();
            return encoding.GetBytes(str);
        }

        public static string GetTempFileName()
        {
            string fileName;
            int attempt = 0;
            bool exit = false;
            do
            {
                fileName = Path.GetRandomFileName();
                fileName = Path.ChangeExtension(fileName, ".tsv");
                fileName = Path.Combine(Path.GetTempPath(), fileName);

                try
                {
                    using (new FileStream(fileName, FileMode.CreateNew)) { }

                    exit = true;
                }
                catch (IOException ex)
                {
                    if (++attempt == 10)
                        throw new IOException("No unique temporary summary name is available.", ex);
                }

            } while (!exit);

            return fileName;
        }

        public static string GetTempFileNameWithExt(string ext)
        {
            string fileName;
            int attempt = 0;
            bool exit = false;
            do
            {
                fileName = Path.GetRandomFileName();
                fileName = Path.ChangeExtension(fileName, ext);
                fileName = Path.Combine(Path.GetTempPath(), fileName);

                try
                {
                    using (new FileStream(fileName, FileMode.CreateNew)) { }

                    exit = true;
                }
                catch (IOException ex)
                {
                    if (++attempt == 10)
                        throw new IOException("No unique temporary summary name is available.", ex);
                }

            } while (!exit);

            return fileName;
        }

        public static byte[] ReadFile(string filePath)
        {
            byte[] buffer;
            FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            try
            {
                int length = (int)fileStream.Length;  // get file length
                buffer = new byte[length];            // create buffer
                int count;                            // actual number of bytes read
                int sum = 0;                          // total number of bytes read

                // read until Read method returns 0 (end of the stream has been reached)
                while ((count = fileStream.Read(buffer, sum, length - sum)) > 0)
                    sum += count;  // sum is a buffer offset for next reading
            }
            finally
            {
                fileStream.Close();
            }
            return buffer;
        }

        //////////////DATA FROM CRYPTOJS
        //enc:U2FsdGVkX19cNNeEUTEspBKuiUus3EFrkTElHDyZd54=
        //key:48390e5076d5f67516b2fd776d1f799b4a61972b2fcaf27d362802c00a00c9c7
        //salt:5c34d78451312ca4
        //iv:c3ed8b19df64a88048bd30e7f82db106


        //string encrypted = "U2FsdGVkX19cNNeEUTEspBKuiUus3EFrkTElHDyZd54=";

        public static string Encrypt(string clearText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    clearText = Convert.ToBase64String(ms.ToArray());
                }
            }
            return clearText;
        }

        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }

        public static string GetMd5Hash(string input)
        {
            MD5 md5Hash = MD5.Create();
            // Convert the input string to a byte array and compute the hash.
            byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

            // Create a new Stringbuilder to collect the bytes
            // and create a string.
            StringBuilder sBuilder = new StringBuilder();

            // Loop through each byte of the hashed data 
            // and format each one as a hexadecimal string.
            for (int i = 0; i < data.Length; i++)
            {
                sBuilder.Append(data[i].ToString("x2"));
            }

            // Return the hexadecimal string.
            return sBuilder.ToString();
        }

        public static void ReadDBFUsingOdbc()
        {
            string strTestDirectory = @"Provider=vfpoledb.1; Data Source=c:\DEV\SJJ\DATA;Exclusive=false;Nulls=false";
            OleDbConnection CC = new OleDbConnection(strTestDirectory);
            CC.Open();
            OleDbCommand cmd = new OleDbCommand("Select Name From acc.dbf where Objtype='USR'", CC);
            OleDbDataReader dr = cmd.ExecuteReader();
            if (dr.HasRows)
            {
                DataTable dt1 = new DataTable();
                dt1.Load(dr);

                foreach (DataRow row in dt1.Rows)
                {
                    LogManager.Write(row[1].ToString());
                }
            }
            CC.Close();


            /*Bind data to grid*/

            //gv1.DataSource = dt1;
            //gv1.DataBind();


            //lblResult.Text = "Congratulations, your .dbf file has been transferred to Grid.";

        }

        ///<summary>
        /// Base 64 Encoding with URL and Filename Safe Alphabet using UTF-8 character set.
        ///</summary>
        ///<param name="str">The origianl string</param>
        ///<returns>The Base64 encoded string</returns>
        public static string Base64ForUrlEncode(string str)
        {
            byte[] encbuff = Encoding.UTF8.GetBytes(str);
            return HttpServerUtility.UrlTokenEncode(encbuff);
        }
        ///<summary>
        /// Decode Base64 encoded string with URL and Filename Safe Alphabet using UTF-8.
        ///</summary>
        ///<param name="str">Base64 code</param>
        ///<returns>The decoded string.</returns>
        public static string Base64ForUrlDecode(string str)
        {
            byte[] decbuff = HttpServerUtility.UrlTokenDecode(str);
            return Encoding.UTF8.GetString(decbuff);
        }

        public static decimal GetDolarTodayRate()
        {
            string url = "https://s3.amazonaws.com/dolartoday/data.json";

            var json_data = string.Empty;

            using (var w = new WebClient())
            {
                // attempt to download JSON data as a string
                try
                {
                    json_data = w.DownloadString(url);
                    // if string with JSON data is not empty, deserialize it to class and return its instance 
                    //return !string.IsNullOrEmpty(json_data) ? JsonConvert.DeserializeObject<T>(json_data) : new T();

                    JObject rss = JObject.Parse(json_data);

                    string strTasa = (string)rss["USD"]["transferencia"];
                    decimal tasa = decimal.Parse(strTasa, new NumberFormatInfo() { NumberDecimalSeparator = "." });

                    return tasa;
                }
                catch (Exception ex) { 
                    LogManager.Write(ex.Message);
                    var curRate = new CurrencyRatesRepository().GetLastRegisteredRate();
                    return curRate != null ? curRate.CurrencyRate : 0;
                }
            }
        }
    }
}

