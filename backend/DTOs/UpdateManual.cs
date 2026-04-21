using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.DTOs
{
    public class UpdateManual
    {
        public string? ManualName { get; set; }
        public string? SystemName { get; set; }
        public string? Status { get; set; }
        public int? CreatedBy { get; set; }
    }
}