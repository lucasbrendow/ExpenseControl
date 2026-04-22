using ExpenseControl.Api.Data;
using ExpenseControl.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _contexto;

        public TransacoesController(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        // GET: api/transacoes - Lista todas as transações
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> Listar()
        {
            var transacoes = await _contexto.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .ToListAsync();

            return Ok(transacoes);
        }

        // POST: api/transacoes - Cria uma nova transação
        [HttpPost]
        public async Task<ActionResult> Criar(Transacao transacao)
        {   
            if (transacao.Valor <= 0)
                return BadRequest("O valor da transação deve ser maior que zero.");

            var pessoa = await _contexto.Pessoas.FindAsync(transacao.PessoaId);
            if (pessoa == null)
                return BadRequest("A pessoa informada não foi encontrada.");

            var categoria = await _contexto.Categorias.FindAsync(transacao.CategoriaId);
            if (categoria == null)
                return BadRequest("A categoria informada não foi encontrada.");

            var idade = CalcularIdade(pessoa.DataNascimento);

            if (idade < 18 && transacao.Tipo == "Receita")
                return BadRequest("Menores de idade só podem possuir transações do tipo despesa.");

            if (!CategoriaAceitaTipoTransacao(categoria.Finalidade, transacao.Tipo))
                return BadRequest("A categoria informada não é compatível com o tipo da transação.");

            _contexto.Transacoes.Add(transacao);
            await _contexto.SaveChangesAsync();

            return Ok(transacao);
        }

        // Método auxiliar para calcular a idade a partir da data de nascimento
        private static int CalcularIdade(DateTime dataNascimento)
        {
            var hoje = DateTime.Today;
            var idade = hoje.Year - dataNascimento.Year;

            if (dataNascimento.Date > hoje.AddYears(-idade))
                idade--;

            return idade;
        }

        // Método auxiliar para verificar se a categoria aceita o tipo da transação
        private static bool CategoriaAceitaTipoTransacao(string finalidadeCategoria, string tipoTransacao)
        {
            if (finalidadeCategoria == "Ambas")
                return true;

            return finalidadeCategoria == tipoTransacao;
        }
    }
}