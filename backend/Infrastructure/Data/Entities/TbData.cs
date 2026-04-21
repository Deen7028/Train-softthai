using System;
using System.Collections.Generic;

namespace Infrastructure.Data.Entities;

public partial class TbData
{
    public int nDataID { get; set; }

    public int nDataTypeID { get; set; }

    public string sDataName { get; set; } = null!;

    public DateTime? dDate { get; set; }

    public DateOnly? dWork { get; set; }

    public int nCreateBy { get; set; }

    public DateTime dCreateDate { get; set; }

    public int nUpdateBy { get; set; }

    public DateTime dUpdateDate { get; set; }

    public string sUpdateIP_By { get; set; } = null!;

    public bool isActive { get; set; }

    public bool isDelete { get; set; }

    public int? nDeleteBy { get; set; }

    public DateTime? dDeleteDate { get; set; }

    public string? sDeleteIP_By { get; set; }

    public int nStatusID { get; set; }

    public virtual TmDataType nDataType { get; set; } = null!;
}
