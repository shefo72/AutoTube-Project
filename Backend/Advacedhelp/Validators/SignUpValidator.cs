using AutoTubeAPI.DTOs.Auth;
using FluentValidation;

namespace AutoTubeAPI.Advacedhelp.Validators;

public class SignUpValidator : AbstractValidator<SignUpDto>
{
    public SignUpValidator()
    {
        //RuleFor(x => x.FullName)
        //    .NotEmpty().WithMessage("Full name is required.")
        //    .MinimumLength(2).WithMessage("Full name must be at least 2 characters.")
        //    .MaximumLength(150).WithMessage("Full name cannot exceed 150 characters.")
        //    .Matches(@"^[a-zA-Z\s\-'\.]+$").WithMessage("Full name can only contain letters, spaces, hyphens, apostrophes, and dots.");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MinimumLength(3).WithMessage("Full name must be at least 3 characters.")
            .MaximumLength(50).WithMessage("Full name cannot exceed 50 characters.")
            .Matches(@"^[\u0600-\u06FFa-zA-Z\s\-'\.]+$")
            .WithMessage("Full name can only contain Arabic or English letters, spaces, hyphens, apostrophes, and dots.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Please enter a valid email address.")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters.")
            .Must(e => !e.Contains("+")).WithMessage("Email addresses with '+' are not allowed."); // optional security rule

        RuleFor(x => x.Password)
        .NotEmpty()
        .WithMessage("Password is required for local sign up.")
        .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
        .MaximumLength(100).WithMessage("Password cannot exceed 100 characters.")
        .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
        .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
        .Matches(@"[0-9]").WithMessage("Password must contain at least one number.");

        RuleFor(x => x.PhoneNumber)
               .NotEmpty()
               .Matches(@"^\+?[1-9]\d{1,14}$") // E.164 format
               .WithMessage("Phone number must be in valid E.164 format (e.g., +1234567890).");
    }
}
