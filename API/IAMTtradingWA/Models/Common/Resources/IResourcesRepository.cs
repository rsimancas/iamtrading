using System;

namespace IAMTradingWA.Models
{
    interface IResourcesRepository
    {
        Nullable<DateTime> GetPreviousDate(int daysAgo, ref string errMsg);
    }
}
