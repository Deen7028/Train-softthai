// Models/SystemManual.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("system_manuals")]
    public class SystemManual
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("sequence_number")]
        public int SequenceNumber { get; set; }

        [Column("manual_name")]
        public string ManualName { get; set; } = string.Empty;

        [Column("system_name")]
        public string SystemName { get; set; } = string.Empty;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}