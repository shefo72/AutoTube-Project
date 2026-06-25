using AutoTubeAPI.DTOs.Auth;
using Autotube.Models;
using Autotube.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoTubeAPI.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AutoTubeDbContext _db;
        private readonly IJwtService _jwtService;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AutoTubeDbContext db, IJwtService jwtService, ILogger<AuthService> logger)
        {
            _db = db;
            _jwtService = jwtService;
            _logger = logger;
        }

        // SIGN UP
        public async Task<AuthResponseDto> SignUpAsync(SignUpDto dto)
        {
            var emailExists = await _db.Users
                .AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            if (emailExists)
            {
                throw new InvalidOperationException("An account with this email already exists.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password, workFactor: 12);
            if (!dto.Role.Equals("User", StringComparison.OrdinalIgnoreCase) && !dto.Role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Invalid role specified. Allowed values are 'User' or 'Admin'.");
            }


            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = dto.Email.ToLower().Trim(),
                PasswordHash = passwordHash,
                AuthProvider = "local",
                //Role = "User",
                Role = dto.Role.ToLower(),
                PhoneNumber = dto.PhoneNumber,
                DateOfBirth = dto.DateOfBirth,
                IsActive = true,
                EmailVerified = false,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            _logger.LogInformation("New user registered: {Email} (ID: {UserId})", user.Email, user.Id);


            var freePlanId = await _db.SubscriptionPlans
                .Where(p => p.Name == "Free Plan")
                .Select(p => p.Id)
                .FirstOrDefaultAsync();

            if (freePlanId == 0) freePlanId = 1;

            var subscription = new Subscription
            {
                UserId = user.Id,
                SubscriptionPlanId = freePlanId,
                Status = "Active",
                StartDate = DateTime.Now
            };
            _db.Subscriptions.Add(subscription);


            var quota = new UsageQuota
            {
                UserId = user.Id,
                GapAnalysesUsed = 0,
                ThumbnailOptimizationsUsed = 0,
                ScriptGenerationsUsed = 0,
                VideoGenerationsUsed = 0,
                ContentGenerationsUsed = 0,
                PeriodStart = DateTime.Now,
                PeriodEnd = DateTime.Now.AddMonths(1)
            };
            _db.UsageQuotas.Add(quota);

            await _db.SaveChangesAsync();
            var token = _jwtService.GenerateToken(user);

            return BuildAuthResponse(user, token);
        }

        // SIGN IN
        public async Task<AuthResponseDto> SignInAsync(SignInDto dto)
        {
            var user = await _db.Users
              .FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());

            var passwordValid = user != null
                && user.PasswordHash != null
                && BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (user == null || !passwordValid)
            {
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

            if ((bool)!user.IsActive)
            {
                throw new UnauthorizedAccessException("Your account has been deactivated. Please contact support.");
            }

            user.LastLoginAt = DateTime.Now;
            user.UpdatedAt = DateTime.Now;
            await _db.SaveChangesAsync();

            _logger.LogInformation("User signed in: {Email} (ID: {UserId})", user.Email, user.Id);

            var token = _jwtService.GenerateToken(user);

            return BuildAuthResponse(user, token);
        }


        // GET USER INFO
        public async Task<UserInfoDto?> GetUserInfoAsync(int userId)
        {
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException("No Data");
            }

            return new UserInfoDto
            {
                UserId = user.Id,
                Email = user.Email ?? "",
                FullName = user.FullName ?? "",
                PhoneNumber = user.PhoneNumber,
                DateOfBirth = user.DateOfBirth ?? new DateOnly(2000, 1, 1),
                CreatedAt = user.CreatedAt
            };
        }


        // GOOGLE LOGIN
        public async Task<AuthResponseDto> GoogleLoginAsync(
         string googleId,
         string email,
         string fullName,
         string? pictureUrl)
        {
            var normalizedEmail = email.ToLower();
            _logger.LogInformation(
            "User Query SQL:\n{Sql}",
            _db.Users.Where(x => x.Id > 0).ToQueryString());
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.GoogleId == googleId || u.Email.ToLower() == normalizedEmail);

            var currentTime = DateTime.Now;

            if (user != null)
            {
                user.GoogleId = googleId;
                user.ProfileImageUrl = pictureUrl ?? user.ProfileImageUrl;
                user.LastLoginAt = currentTime;
                user.UpdatedAt = currentTime;

                if (user.AuthProvider == "local")
                    user.AuthProvider = "google_linked";

                await _db.SaveChangesAsync();
                _logger.LogInformation("Google sign-in for existing user: {Email}", email);
            }
            else
            {
                try
                {
                    var dummyPassword = Guid.NewGuid().ToString() + "AutoTube26@!";
                    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dummyPassword);

                    user = new User
                    {
                        FullName = fullName,
                        Email = normalizedEmail,
                        GoogleId = googleId,
                        ProfileImageUrl = pictureUrl,
                        AuthProvider = "google",
                        Role = "user",
                        PasswordHash = hashedPassword,
                        IsActive = true,
                        EmailVerified = true,
                        CreatedAt = currentTime,
                        UpdatedAt = currentTime,
                        LastLoginAt = currentTime
                    };

                    _db.Users.Add(user);
                    await _db.SaveChangesAsync();


                    var freePlanId = await _db.SubscriptionPlans
                        .Where(p => p.Name == "Free Plan")
                        .Select(p => p.Id)
                        .FirstOrDefaultAsync();

                    if (freePlanId == 0) freePlanId = 1;

                    _db.Subscriptions.Add(new Subscription
                    {
                        UserId = user.Id,
                        SubscriptionPlanId = freePlanId,
                        Status = "Active",
                        StartDate = currentTime
                    });

                    _db.UsageQuotas.Add(new UsageQuota
                    {
                        UserId = user.Id,
                        GapAnalysesUsed = 0,
                        ThumbnailOptimizationsUsed = 0,
                        ScriptGenerationsUsed = 0,
                        VideoGenerationsUsed = 0,
                        ContentGenerationsUsed = 0,
                        PeriodStart = currentTime,
                        PeriodEnd = currentTime.AddMonths(1),
                    });

                    await _db.SaveChangesAsync();
                    _logger.LogInformation("New Google user registered successfully: {Email}", email);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to register new Google user: {Email}", email);
                    throw;
                }
            }

            var token = _jwtService.GenerateToken(user);
            return BuildAuthResponse(user, token);
        }

        // PRIVATE HELPERS
        private AuthResponseDto BuildAuthResponse(User user, string token)
        {
            return new AuthResponseDto
            {
                Token = token,
                ExpiresAt = _jwtService.GetExpirationTime(),
                User = new UserInfoDto
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Role = user.Role.ToLower(),
                    DateOfBirth = user.DateOfBirth ?? new DateOnly(2000, 1, 1),
                    ProfileImageUrl = user.ProfileImageUrl,
                    AuthProvider = user.AuthProvider,
                    CreatedAt = user.CreatedAt,
                }
            };
        }
    }
}
