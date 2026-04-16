using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class UpdateManual
    {
        public string? Title { get; set; }
        public string? System { get; set; }
        public string? Status { get; set; }
        public int? CreatedBy { get; set; }
    }
}