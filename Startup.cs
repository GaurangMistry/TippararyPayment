using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TippararyPayment.Startup))]
namespace TippararyPayment
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
