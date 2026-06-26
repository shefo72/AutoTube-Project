namespace Autotube.Services.All_in_One.Video
{
    public interface IAllInOneVideoPollingService
    {
        Task ProcessPendingVideosAsync();
    }
}
