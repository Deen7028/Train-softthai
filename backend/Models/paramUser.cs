using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    [Table("TmUsers")]
    public class Users 
    {
        [Key]
        [Column("nUserId")]
        public int Id {get; set;}

        [Column("sUserName")]
        public string UserName {get; set;} = string.Empty;

        [Column("sEmail")]
        public string Email {get; set;} = string.Empty;

        [Column("isActive")]
        public bool IsActive {get; set;} = true;


    }
}