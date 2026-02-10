using Application.DTOs.Requests;
using FluentValidation;

namespace Application.Validators;

/// <summary>
/// Validator for SubmitPartnerRequest
/// </summary>
public class SubmitPartnerValidator : AbstractValidator<SubmitPartnerRequest>
{
    public SubmitPartnerValidator()
    {
        RuleFor(x => x.Organization)
            .NotEmpty().WithMessage("Organization is required")
            .MaximumLength(255).WithMessage("Organization must not exceed 255 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category must not exceed 100 characters");
    }
}
