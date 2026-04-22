using ExpenseControl.Api.Data;
using ExpenseControl.Api.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _contexto;

        public CategoriasController(AppDbContext contexto)
        {
            _contexto = contexto;
        }

        // GET: api/categorias - Listagem de todas as categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> Listar()
        {
            var categorias = await _contexto.Categorias.ToListAsync();
            return Ok(categorias);
        }

        // POST: api/categorias - Criação de nova categoria
        [HttpPost]
        public async Task<ActionResult<Categoria>> Criar(Categoria categoria)
        {
            _contexto.Categorias.Add(categoria);
            await _contexto.SaveChangesAsync();

            return Ok(categoria);
        }

        // GET: api/categorias/totais-por-categoria - Obter totais de receitas e despesas por categoria
        [HttpGet("totais-por-categoria")]
        public async Task<IActionResult> ObterTotaisPorCategoria()
        {
            var categorias = await _contexto.Categorias.ToListAsync();
            var transacoes = await _contexto.Transacoes.ToListAsync();

            var resultado = categorias.Select(c =>
            {
                var transacoesCategoria = transacoes.Where(t => t.CategoriaId == c.Id);

                var receitas = transacoesCategoria
                    .Where(t => t.Tipo == "Receita")
                    .Sum(t => t.Valor);

                var despesas = transacoesCategoria
                    .Where(t => t.Tipo == "Despesa")
                    .Sum(t => t.Valor);

                return new
                {
                    id = c.Id,
                    descricao = c.Descricao,
                    receitas,
                    despesas,
                    saldo = receitas - despesas
                };
            });

            var totalReceitas = resultado.Sum(x => x.receitas);
            var totalDespesas = resultado.Sum(x => x.despesas);

            return Ok(new
            {
                categorias = resultado,
                totalGeral = new
                {
                    totalReceitas,
                    totalDespesas,
                    saldo = totalReceitas - totalDespesas
                }
            });
        }
    }
}