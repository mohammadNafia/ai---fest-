using Application.DTOs.Requests;
using FluentValidation;

namespace Application.Validators;

/// <summary>
/// Validator for RegisterAttendeeRequest
/// </summary>
public class RegisterAttendeeValidator : AbstractValidator<RegisterAttendeeRequest>
{
    public RegisterAttendeeValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(255).WithMessage("Name must not exceed 255 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
            .MaximumLength(100).WithMessage("Password must not exceed 100 characters");

        RuleFor(x => x.Age)
            .GreaterThan(0).WithMessage("Age must be greater than 0")
            .LessThanOrEqualTo(120).WithMessage("Invalid age");

        RuleFor(x => x.Occupation)
            .NotEmpty().WithMessage("Occupation is required")
            .MaximumLength(255).WithMessage("Occupation must not exceed 255 characters");

        RuleFor(x => x.Organization)
            .NotEmpty().WithMessage("Organization is required")
            .MaximumLength(255).WithMessage("Organization must not exceed 255 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters");

        RuleFor(x => x.Motivation)
            .NotEmpty().WithMessage("Motivation is required")
            .MinimumLength(10).WithMessage("Motivation must be at least 10 characters");
    }
}
