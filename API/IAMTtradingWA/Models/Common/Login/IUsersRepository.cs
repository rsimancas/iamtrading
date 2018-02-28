using System.Collections.Generic;

namespace IAMTradingWA.Models
{
    interface IUsersRepository
    {
        IList<User> GetAll(int page, int start, int limit, ref int totalRecord);
        User Get(string id);
        User Add(User usuario);
        void Remove(User usuario);
        bool Update(User usuario);
        User ValidLogon(string userName, string userPassword);
        string GenToken(User usuario);
    }
}
