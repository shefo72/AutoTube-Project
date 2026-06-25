using Autotube.DTOs.All_in_One.Script;

namespace Autotube.Services.All_in_One.Script
{
    public interface IAllGeminiService
    {
        Task<ScriptResponse> GenerateScriptAsync(AllScriptRequest request);
    }
}
