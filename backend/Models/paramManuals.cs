using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Tbmanuals")]
    public class Manuals 
    {
        [Key]
        [Column("nId")]
        public int Id { get; set; }

        [Column("nSequence_number")]
        public int SequenceNumber { get; set; }

        [Column("sManualName")]
        public string ManualName { get; set; } = string.Empty;

        [Column("sSystemName")]
        public string SystemName { get; set; } = string.Empty;

        [Column("isActive")]
        public bool IsActive { get; set; } = true;

        [Column("dCreated_at")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        [Column("dUpdated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        [Column("nCreatedBy")]
        public int? CreatedBy { get; set; }
    }
}