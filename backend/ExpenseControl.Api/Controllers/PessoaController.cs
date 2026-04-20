using ExpenseControl.Api.Data;
using ExpenseControl.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoaController : ControllerBase
    {
        private readonly AppDbContext _contexto;

        public PessoaController(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> Listar()
        {
            var pessoas = await _contexto.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> Obter(int id)
        {
            var pessoa = await _contexto.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound();

            return Ok(pessoa);
        }

        [HttpPost]
        public async Task<ActionResult<Pessoa>> Criar(Pessoa pessoa)
        {
            _contexto.Pessoas.Add(pessoa);
            await _contexto.SaveChangesAsync();

            return CreatedAtAction(nameof(Obter), new { id = pessoa.Id }, pessoa);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Atualizar(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
                return BadRequest();

            _contexto.Entry(pessoa).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Excluir(int id)
        {
            var pessoa = await _contexto.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound();

            _contexto.Pessoas.Remove(pessoa);
            await _contexto.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("totais")]
        public async Task<ActionResult> ObterTotais()
        {
            
        var pessoas = await _contexto.Pessoas.ToListAsync();

            var resultado = new List<object>();

            decimal totalReceitasGeral = 0;
            decimal totalDespesasGeral = 0;

            foreach (var pessoa in pessoas)
            {
                var transacoes = await _contexto.Transacoes
                    .Where(t => t.PessoaId == pessoa.Id)
                    .ToListAsync();

                var receitas = transacoes
                    .Where(t => t.Tipo == "Receita")
                    .Sum(t => t.Valor);

                var despesas = transacoes
                    .Where(t => t.Tipo == "Despesa")
                    .Sum(t => t.Valor);

                var saldo = receitas - despesas;

                totalReceitasGeral += receitas;
                totalDespesasGeral += despesas;

                resultado.Add(new
                {
                    pessoa.Id,
                    pessoa.Nome,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = saldo
                });
            }

            var totalGeral = new
            {
                TotalReceitas = totalReceitasGeral,
                TotalDespesas = totalDespesasGeral,
                Saldo = totalReceitasGeral - totalDespesasGeral
            };

            return Ok(new
            {
                Pessoas = resultado,
                TotalGeral = totalGeral
            });
        }
    }
}