using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class TmDataType
{
    public int nDataTypeID { get; set; }

    public string sDataTypeName { get; set; } = null!;

    public bool isDelete { get; set; }

    public virtual ICollection<TbData> TbData { get; set; } = new List<TbData>();
}
