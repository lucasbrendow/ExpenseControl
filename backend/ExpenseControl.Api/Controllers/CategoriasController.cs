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
    }
}