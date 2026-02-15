using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "frontend"
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".m4a"] = "audio/mp4";
app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});
app.UseAuthorization();
app.MapControllers();

var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    app.Urls.Add($"http://0.0.0.0:{port}");
}

app.Run();
