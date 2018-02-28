using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IUsersLastSelectionsRepository
    {
        UsersLastSelected Get(int id, ref string errMsg);
        UsersLastSelected Add(UsersLastSelected data, ref string errMsg);
        bool Remove(UsersLastSelected data, ref string errMsg);
        UsersLastSelected Update(UsersLastSelected data, ref string errMsg);
        IList<UsersLastSelected> GetList(string query, Sort sort, int page, int start, int limit, ref int totalRecords, ref string errorMsg);
        UsersLastSelected GetPOVByUser(string user, int id, ref string errMsg);
    }
}
