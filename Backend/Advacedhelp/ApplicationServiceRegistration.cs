using Autotube.Behaviors;
using Autotube.Data.Mappings;
using FluentValidation;
using MediatR;

namespace Autotube.Advacedhelp
{
    public static class ApplicationServiceRegistration
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(MappingProfile).Assembly);

            services.AddMediatR(typeof(ApplicationServiceRegistration).Assembly);

            services.AddValidatorsFromAssembly(typeof(ApplicationServiceRegistration).Assembly);

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

            return services;
        }
    }
}
