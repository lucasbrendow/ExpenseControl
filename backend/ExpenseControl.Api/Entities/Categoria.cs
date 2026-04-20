using System.ComponentModel.DataAnnotations;

namespace ExpenseControl.Api.Entities
{
    public class Categoria
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public string Finalidade { get; set; } = string.Empty;
    }
}