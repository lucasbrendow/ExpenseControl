using ExpenseControl.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Data
{
    public class AppDbContext : DbContext
    {
        // Construtor que recebe as opções de configuração do DbContext
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // DbSets para as entidades
        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }

        // Configurações adicionais do modelo
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Pessoa)
                .WithMany()
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Categoria)
                .WithMany()
                .HasForeignKey(t => t.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}