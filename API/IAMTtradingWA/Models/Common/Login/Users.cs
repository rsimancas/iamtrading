namespace IAMTradingWA.Models
{
    public class User
    {
        public string UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserFullName { get; set; }
        public string UserPassword { get; set; }
        public int UserLevel { get; set; }
        public int? RoleId { get; set; }
    }
}