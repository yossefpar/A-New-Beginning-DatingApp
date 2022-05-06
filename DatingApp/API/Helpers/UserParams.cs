using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
         public int PageSize
         {
             get => _pageSize;
             set => _pageSize = Math.Min(MaxPageSize , value);
         }
        public string CurrnetUsername { get; set; }
        public string Gender { get; set; }
        public int MaxAge { get; set; } = 150;
        public int MinAge { get; set; } = 18;
        public string OrderBy { get; set; } = "lastActive";
    }
}