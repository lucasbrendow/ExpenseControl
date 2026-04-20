using System.ComponentModel.DataAnnotations;

namespace ExpenseControl.Api.Entities
{
    public class Pessoa
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public DateTime DataNascimento { get; set; }
    }
}