
using AutoTubeAPI.DTOs.Auth;
using FluentValidation;

namespace AutoTubeAPI.Advacedhelp.Validators
{
    public class SignInValidator : AbstractValidator<SignInDto>
    {
        public SignInValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Please enter a valid email address.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(1).WithMessage("Password cannot be empty.");
        }
    }
}