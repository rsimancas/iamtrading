using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IAMTradingWA.Clases
{
    public static class ExceptionExtensions
    {
        public static Exception GetOriginalException(this Exception ex)
        {
            while (ex.InnerException != null) ex = ex.InnerException;
            return ex;
        }
    }
}