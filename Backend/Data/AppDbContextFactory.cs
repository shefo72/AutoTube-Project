using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Autotube.Data
{
    public class AutoTubeDbContextFactory
        : IDesignTimeDbContextFactory<AutoTubeDbContext>
    {
        public AutoTubeDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString =
                configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder =
                new DbContextOptionsBuilder<AutoTubeDbContext>();

            optionsBuilder.UseSqlServer(connectionString); 

            return new AutoTubeDbContext(optionsBuilder.Options);
        }
    }
}