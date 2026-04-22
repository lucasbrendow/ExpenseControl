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

        // GET: api/pessoa - Listagem de todas as pessoas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pessoa>>> Listar()
        {
            var pessoas = await _contexto.Pessoas.ToListAsync();
            return Ok(pessoas);
        }

        // GET: api/pessoa/{id} - Obter detalhes de uma pessoa específica
        [HttpGet("{id}")]
        public async Task<ActionResult<Pessoa>> Obter(int id)
        {
            var pessoa = await _contexto.Pessoas.FindAsync(id);

            if (pessoa == null)
                return NotFound();

            return Ok(pessoa);
        }

        // POST: api/pessoa - Criação de nova pessoa
        [HttpPost]
        public async Task<ActionResult<Pessoa>> Criar(Pessoa pessoa)
        {
            _contexto.Pessoas.Add(pessoa);
            await _contexto.SaveChangesAsync();

            return CreatedAtAction(nameof(Obter), new { id = pessoa.Id }, pessoa);
        }

        // PUT: api/pessoa/{id} - Atualização de pessoa existente
        [HttpPut("{id}")]
        public async Task<ActionResult> Atualizar(int id, Pessoa pessoa)
        {
            if (id != pessoa.Id)
                return BadRequest();

            _contexto.Entry(pessoa).State = EntityState.Modified;
            await _contexto.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/pessoa/{id} - Exclusão de pessoa
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

        // GET: api/pessoa/totais - Obter totais de receitas, despesas e saldo para cada pessoa
        [HttpGet("totais")]
        public async Task<ActionResult> ObterTotais()
        {
            var pessoas = await _contexto.Pessoas.ToListAsync();

            var resultado = new List<object>();

            decimal totalReceitasGeral = 0;
            decimal totalDespesasGeral = 0;

            // Calcula, para cada pessoa, o total de receitas, despesas e saldo
            foreach (var pessoa in pessoas)
            {
                // Obtém todas as transações da pessoa
                var transacoes = await _contexto.Transacoes
                    .Where(t => t.PessoaId == pessoa.Id)
                    .ToListAsync();

                // Calcula o total de receitas para a pessoa
                var receitas = transacoes
                    .Where(t => t.Tipo == "Receita")
                    .Sum(t => t.Valor);

                // Calcula o total de despesas para a pessoa
                var despesas = transacoes
                    .Where(t => t.Tipo == "Despesa")
                    .Sum(t => t.Valor);

                // Calcula o saldo (receitas - despesas)
                var saldo = receitas - despesas;

                // Acumula os totais gerais
                totalReceitasGeral += receitas;
                totalDespesasGeral += despesas;                

                // Adiciona os totais da pessoa ao resultado
                resultado.Add(new
                {
                    pessoa.Id,
                    pessoa.Nome,
                    Receitas = receitas,
                    Despesas = despesas,
                    Saldo = saldo
                });
            }

            // Calcula totais gerais
            var totalGeral = new
            {
                TotalReceitas = totalReceitasGeral,
                TotalDespesas = totalDespesasGeral,
                Saldo = totalReceitasGeral - totalDespesasGeral
            };

            // Retorna o resultado com os totais por pessoa e o total geral
            return Ok(new
            {
                Pessoas = resultado,
                TotalGeral = totalGeral
            });
        }
    }
}