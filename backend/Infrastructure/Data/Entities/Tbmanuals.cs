using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class Tbmanuals
{
    public int nId { get; set; }

    public int nSequence_number { get; set; }

    public string sManualName { get; set; } = null!;

    public string sSystemName { get; set; } = null!;

    public bool isActive { get; set; }

    public DateTime? dCreated_at { get; set; }

    public DateTime? dUpdated_at { get; set; }

    public int? nCreatedBy { get; set; }
    public bool? isDeleted { get; set; }
}
