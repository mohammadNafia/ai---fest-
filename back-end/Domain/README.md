# Domain Layer

This is the core domain layer of the Baghdad AI Summit application. It contains the business entities, enums, and interfaces that represent the core business logic.

## Structure

```
Domain/
├── Entities/          # Domain entities (User, AttendeeRegistration, etc.)
├── Enums/            # Domain enumerations (UserRole, SubmissionStatus, etc.)
└── Interfaces/       # Domain interfaces (IEntity, IAuditable, etc.)
```

## Entities

- **User**: Represents a user in the system
- **AttendeeRegistration**: Represents an attendee registration
- **SpeakerApplication**: Represents a speaker application
- **PartnerRequest**: Represents a partnership request
- **ActivityLog**: Tracks system activities
- **AuditTrail**: Tracks data changes for auditing

## Enums

- **UserRole**: Guest, User, Admin, Staff, Reviewer
- **SubmissionStatus**: Pending, Approved, Rejected
- **EntityType**: Attendee, Speaker, Partner
- **ActionType**: Created, Updated, Deleted, Approved, Rejected

## Interfaces

- **IEntity**: Base interface for all entities (Id property)
- **IAuditable**: Interface for entities that track creation/modification
- **ISoftDeletable**: Interface for entities that support soft deletion

## Principles

- ✅ No dependencies on Infrastructure or API layers
- ✅ Pure business logic only
- ✅ No database-specific code
- ✅ No HTTP-specific code
- ✅ Self-contained and testable
