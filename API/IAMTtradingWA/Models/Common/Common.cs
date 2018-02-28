
namespace IAMTradingWA.Models
{
    public class Sec
    {
        public int SecValor { get; set; }
        public string SecPrefijo { get; set; }
    }

    public class Filter
    {
        public string property { get; set; }
        public string value { get; set; }
    }

    public class Sort
    {
        public string property { get; set; }
        public string direction { get; set; }
    }

    public class FilterGrid
    {
        public string type { get; set; }
        public string field { get; set; }
        public string value { get; set; }
    }
}