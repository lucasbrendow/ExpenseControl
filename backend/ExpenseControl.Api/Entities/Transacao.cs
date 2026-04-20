using System.ComponentModel.DataAnnotations;

namespace ExpenseControl.Api.Entities
{
    public class Transacao
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public decimal Valor { get; set; }

        [Required]
        public string Tipo { get; set; } = string.Empty; // Despesa ou Receita

        [Required]
        public int CategoriaId { get; set; }

        [Required]
        public int PessoaId { get; set; }

        public Categoria? Categoria { get; set; }
        public Pessoa? Pessoa { get; set; }
    }
}