﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IAMTradingWA.Clases
{
    public class FieldFilter
    {
        public string name { get; set; }
        public string value { get; set; }
        public string type { get; set; }
    }

    public class FieldFilters {
        public List<FieldFilter> fields { get; set; }
    }
}