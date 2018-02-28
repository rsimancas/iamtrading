using System;

namespace IAMTradingWA.Models
{
    public class Img
    {
        public int AttachId { get; set; }
        public int? ItemId { get; set; }
        public string ImageDesc { get; set; }
        public string ImagePath { get; set; }
        public string ImageContentType { get; set; }
    }
}