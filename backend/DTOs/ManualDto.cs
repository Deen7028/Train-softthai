using System;

namespace backend.DTOs
{
    public class ManualDto
    {
        public int Id { get; set; }
        public int SequenceNumber    { get; set; }
        public string ManualName { get; set; } = string.Empty;
        public string SystemName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int? CreatedBy { get; set; }
        public string CreatorName { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }
    }
}
