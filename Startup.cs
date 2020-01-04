using Microsoft.AspNetCore.Components.Builder;
using Blazored.LocalStorage;
using Microsoft.Extensions.DependencyInjection;

namespace DearDiary
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddBlazoredLocalStorage();
        }

        public void Configure(IComponentsApplicationBuilder app)
        {
            app.AddComponent<App>("app");
        }
    }
}
