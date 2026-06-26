using AutoMapper;
using Autotube.DTOs;
using Autotube.Models;
using AutoTubeAPI.DTOs.Auth;


namespace Autotube.Data.Mappings;

public class AutoTubeMappingProfile : Profile
{
    public AutoTubeMappingProfile()
    {
       
        CreateMap<User, UserInfoDto>()
            .ForMember(dest => dest.UserId,          opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.FullName,         opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Email,            opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.ProfileImageUrl,  opt => opt.MapFrom(src => src.ProfileImageUrl))
            .ForMember(dest => dest.AuthProvider,     opt => opt.MapFrom(src => src.AuthProvider))
            .ForMember(dest => dest.CreatedAt,        opt => opt.MapFrom(src => src.CreatedAt))
            .ForMember(dest => dest.DateOfBirth,        opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.PhoneNumber,        opt => opt.MapFrom(src => src.PhoneNumber))
            .ReverseMap();


        CreateMap<YouTubeChannel, YouTubeChannelDto>()
            .ForMember(dest => dest.ChannelId,                opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.YouTubeChannelExternalId , opt => opt.MapFrom(src => src.YoutubeChannelExternalId))
            .ForMember(dest => dest.ChannelTitle,             opt => opt.MapFrom(src => src.ChannelTitle))
            .ForMember(dest => dest.ChannelDescription,       opt => opt.MapFrom(src => src.ChannelDescription))
            .ForMember(dest => dest.ChannelThumbnailUrl,      opt => opt.MapFrom(src => src.ChannelThumbnailUrl))
            .ForMember(dest => dest.SubscriberCount,          opt => opt.MapFrom(src => src.SubscriberCount))
            .ForMember(dest => dest.VideoCount,               opt => opt.MapFrom(src => src.VideoCount))
            .ForMember(dest => dest.ViewCount,                opt => opt.MapFrom(src => src.ViewCount))
            .ForMember(dest => dest.IsActive,                 opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.ConnectedAt,              opt => opt.MapFrom(src => src.ConnectedAt))
            .ForMember(dest => dest.LastSyncedAt,             opt => opt.MapFrom(src => src.LastSyncedAt))
            .ReverseMap();
    }
}
