using Application.DTOs.Requests;
using FluentValidation;

namespace Application.Validators;

/// <summary>
/// Validator for SubmitSpeakerRequest
/// </summary>
public class SubmitSpeakerValidator : AbstractValidator<SubmitSpeakerRequest>
{
    public SubmitSpeakerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(255).WithMessage("Name must not exceed 255 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.Occupation)
            .NotEmpty().WithMessage("Occupation is required")
            .MaximumLength(255).WithMessage("Occupation must not exceed 255 characters");

        RuleFor(x => x.Institution)
            .NotEmpty().WithMessage("Institution is required")
            .MaximumLength(255).WithMessage("Institution must not exceed 255 characters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .MaximumLength(50).WithMessage("Phone must not exceed 50 characters");

        RuleFor(x => x.Skills)
            .NotEmpty().WithMessage("Skills are required")
            .MinimumLength(10).WithMessage("Skills must be at least 10 characters");

        RuleFor(x => x.Experience)
            .NotEmpty().WithMessage("Experience is required")
            .MinimumLength(10).WithMessage("Experience must be at least 10 characters");

        RuleFor(x => x.Topics)
            .NotEmpty().WithMessage("Topics are required")
            .MinimumLength(10).WithMessage("Topics must be at least 10 characters");
    }
}
