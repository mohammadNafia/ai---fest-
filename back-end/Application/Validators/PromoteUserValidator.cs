using Application.DTOs.Requests;
using FluentValidation;
using System.Linq;

namespace Application.Validators;

/// <summary>
/// Validator for PromoteUserRequest
/// </summary>
public class PromoteUserValidator : AbstractValidator<PromoteUserRequest>
{
    public PromoteUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.PromotionType)
            .NotEmpty().WithMessage("Promotion type is required")
            .Must(type => new[] { "speaker", "partner", "staff" }.Contains(type.ToLower()))
            .WithMessage("Promotion type must be 'speaker', 'partner', or 'staff'");

        // If promoting to partner, organization is required
        When(x => x.PromotionType.ToLower() == "partner", () =>
        {
            RuleFor(x => x.Organization)
                .NotEmpty().WithMessage("Organization is required when promoting to partner");
        });

        // If promoting to speaker, occupation and institution are recommended
        When(x => x.PromotionType.ToLower() == "speaker", () =>
        {
            RuleFor(x => x.Occupation)
                .NotEmpty().WithMessage("Occupation is required when promoting to speaker");
            RuleFor(x => x.Institution)
                .NotEmpty().WithMessage("Institution is required when promoting to speaker");
        });
    }
}
