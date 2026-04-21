using System;
using System.Collections.Generic;

namespace backend.Models
{
    public partial class tbPosts
    {
        public int nId { get; set; }

        public string sTitle { get; set; } = null!;

        public string? sNote { get; set; }

        public DateOnly dStartDate { get; set; }

        public DateOnly dEndDate { get; set; }

        public bool isShowAlways { get; set; }

        public int nStatusId { get; set; }
    }
}