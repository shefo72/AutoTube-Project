using Autotube.DTOs.All_in_One.Video;
using System.Text;
using System.Text.Json;

namespace Autotube.Services.All_in_One.Video
{
    public class VideoPromptBuilder : IVideoPromptBuilder
    {
        public Task<string> BuildAsync(AllInOneVideoRequestDto request)
        {
            var prompt = BuildVideoPrompt(
                request.Prompt,
                request.VoiceTone,
                request.VideoStyle);

            return Task.FromResult(prompt);
        }

        private static string BuildVideoPrompt(
            string idea,
            string voiceTone,
            string videoStyle)
        {
            return $"""
Create a video about: {idea}.

Use a {voiceTone} tone throughout the visuals and atmosphere. {BuildToneEnhancement(voiceTone)}

Apply a {videoStyle} visual style. {BuildStyleEnhancement(videoStyle)}

Include cinematic camera movement, professional composition, immersive lighting, realistic motion, and visually engaging scenes.

Maintain visual consistency and high production quality.
""";
        }

        private static string BuildToneEnhancement(string tone)
        {
            return tone switch
            {
                "Motivational" =>
                    "Focus on determination, perseverance, growth, hope, and achievement.",

                "Energetic" =>
                    "Emphasize excitement, momentum, action, and dynamic visuals.",

                "Professional" =>
                    "Use polished visuals, clear presentation, and structured composition.",

                "Narrator" =>
                    "Use documentary-style storytelling and informative visual presentation.",

                "Calm" =>
                    "Use peaceful pacing, balanced composition, and a relaxing atmosphere.",

                _ => string.Empty
            };
        }

        private static string BuildStyleEnhancement(string style)
        {
            return style switch
            {
                "Cinematic" =>
                    "Film-quality visuals, dramatic framing, and cinematic depth.",

                "Documentary" =>
                    "Authentic environments, natural camera work, and realistic details.",

                "Futuristic" =>
                    "Advanced technology, sleek design, and futuristic aesthetics.",

                "Realistic" =>
                    "Natural environments, believable motion, realistic human behavior, and grounded visuals.",

                "Anime" =>
                    "Stylized animation, expressive visuals, and vibrant colors.",

                "Luxury" =>
                    "Premium aesthetics, elegant environments, and sophisticated details.",

                "Sports" =>
                    "Dynamic action, athletic performance, and high-energy visuals.",

                _ => string.Empty
            };
        }
    }
}
