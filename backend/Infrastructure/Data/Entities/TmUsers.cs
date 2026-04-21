using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class TmUsers
{
    public int nUserId { get; set; }

    public string sUserName { get; set; } = null!;

    public string sEmail { get; set; } = null!;

    public bool isActive { get; set; }
}
