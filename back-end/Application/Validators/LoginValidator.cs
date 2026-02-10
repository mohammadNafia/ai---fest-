using Application.DTOs.Requests;
using FluentValidation;

namespace Application.Validators;

/// <summary>
/// Validator for LoginRequest
/// </summary>
public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.EmailOrPhone)
            .NotEmpty().WithMessage("Email or phone number is required");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");
    }
}
