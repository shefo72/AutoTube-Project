using Autotube.DTOs.All_in_One.Script;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Autotube.DTOs.All_in_One.Script
{
    internal class GeminiScriptJson
    {
        [JsonPropertyName("smart_description")]
        public string SmartDescription { get; set; } = string.Empty;

        [JsonPropertyName("top_hooks")]
        public List<string> TopHooks { get; set; } = new();

        [JsonPropertyName("hook")]
        public ScriptSection Hook { get; set; } = new();

        [JsonPropertyName("introduction")]
        public ScriptSection Introduction { get; set; } = new();

        [JsonPropertyName("main_content")]
        public ScriptSection MainContent { get; set; } = new();

        [JsonPropertyName("cta_outro")]
        public ScriptSection CtaOutro { get; set; } = new();

        [JsonPropertyName("stats")]
        public ScriptStats Stats { get; set; } = new();
    }
}