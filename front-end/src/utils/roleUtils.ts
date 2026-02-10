/**
 * Role Utilities - Flexible role handling with normalization and validation
 * Handles role variations, typos, and provides type-safe role operations
 */

import type { UserRole } from '@/types';

// ============================================================================
// ROLE DEFINITIONS
// ============================================================================

/**
 * Valid user roles in the system
 */
export const VALID_ROLES: readonly UserRole[] = ['guest', 'user', 'admin', 'staff', 'reviewer'] as const;

/**
 * Role aliases - maps common variations/typos to correct roles
 * This makes the system more flexible and forgiving
 */
const ROLE_ALIASES: Record<string, UserRole> = {
  // Correct spellings
  'guest': 'guest',
  'user': 'user',
  'admin': 'admin',
  'administrator': 'admin',
  'staff': 'staff',
  'reviewer': 'reviewer',
  'review': 'reviewer',
  
  // Common typos/variations
  'rolo': 'user',        // Common typo: "rolo" -> "user"
  'rol': 'user',         // Abbreviation
  'usr': 'user',         // Abbreviation
  'adm': 'admin',        // Abbreviation
  'admn': 'admin',       // Typo
  'adim': 'admin',       // Typo
  'admi': 'admin',       // Typo
  'gst': 'guest',        // Abbreviation
  'gues': 'guest',       // Typo
  'stf': 'staff',        // Abbreviation
  'staf': 'staff',       // Typo
  'rev': 'reviewer',     // Abbreviation
  'revw': 'reviewer',    // Typo
  
  // Case variations (normalized to lowercase)
  'GUEST': 'guest',
  'USER': 'user',
  'ADMIN': 'admin',
  'STAFF': 'staff',
  'REVIEWER': 'reviewer',
  'Guest': 'guest',
  'User': 'user',
  'Admin': 'admin',
  'Staff': 'staff',
  'Reviewer': 'reviewer',
  
  // Common alternative names
  'member': 'user',
  'participant': 'user',
  'attendee': 'user',
  'moderator': 'staff',
  'editor': 'reviewer',
};

/**
 * Role hierarchy - defines which roles have more permissions
 * Higher number = more permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  user: 1,
  reviewer: 2,
  staff: 3,
  admin: 4,
};

// ============================================================================
// ROLE NORMALIZATION
// ============================================================================

/**
 * Normalizes a role string to a valid UserRole
 * Handles typos, case variations, and aliases
 * 
 * @param role - The role to normalize (can be any string)
 * @param defaultRole - Default role if normalization fails (default: 'guest')
 * @returns A valid UserRole
 * 
 * @example
 * normalizeRole('rolo') // Returns 'user'
 * normalizeRole('ADMIN') // Returns 'admin'
 * normalizeRole('invalid') // Returns 'guest' (default)
 */
export function normalizeRole(role: unknown, defaultRole: UserRole = 'guest'): UserRole {
  if (!role || typeof role !== 'string') {
    return defaultRole;
  }

  // Trim and lowercase for comparison
  const normalized = role.trim().toLowerCase();

  // Check direct alias match
  if (ROLE_ALIASES[normalized]) {
    return ROLE_ALIASES[normalized];
  }

  // Check if it's already a valid role
  if (VALID_ROLES.includes(normalized as UserRole)) {
    return normalized as UserRole;
  }

  // Fuzzy matching for common typos
  const fuzzyMatch = findFuzzyRoleMatch(normalized);
  if (fuzzyMatch) {
    return fuzzyMatch;
  }

  // Return default if no match found
  return defaultRole;
}

/**
 * Finds a fuzzy match for a role string
 * Handles common typos and variations
 */
function findFuzzyRoleMatch(input: string): UserRole | null {
  // Remove common typos/characters
  const cleaned = input
    .replace(/[^a-z]/g, '') // Remove non-letters
    .replace(/o{2,}/g, 'o') // Replace double 'o' with single
    .replace(/l{2,}/g, 'l'); // Replace double 'l' with single

  // Check against valid roles with fuzzy matching
  for (const validRole of VALID_ROLES) {
    // Exact match after cleaning
    if (cleaned === validRole) {
      return validRole;
    }

    // Check if cleaned input contains valid role
    if (cleaned.includes(validRole) || validRole.includes(cleaned)) {
      return validRole;
    }

    // Check Levenshtein-like distance for very similar strings
    if (calculateSimilarity(cleaned, validRole) > 0.7) {
      return validRole;
    }
  }

  return null;
}

/**
 * Calculates similarity between two strings (0-1)
 * Simple implementation for role matching
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  // Count matching characters
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) {
      matches++;
    }
  }

  return matches / longer.length;
}

// ============================================================================
// ROLE VALIDATION
// ============================================================================

/**
 * Validates if a value is a valid UserRole
 * 
 * @param role - The role to validate
 * @returns True if valid, false otherwise
 */
export function isValidRole(role: unknown): role is UserRole {
  return typeof role === 'string' && VALID_ROLES.includes(role as UserRole);
}

/**
 * Validates and normalizes a role, throwing an error if invalid
 * 
 * @param role - The role to validate
 * @param allowDefault - If true, returns default role instead of throwing
 * @returns A valid UserRole
 * @throws Error if role is invalid and allowDefault is false
 */
export function validateRole(role: unknown, allowDefault: boolean = true): UserRole {
  if (isValidRole(role)) {
    return role;
  }

  if (allowDefault) {
    return normalizeRole(role);
  }

  throw new Error(`Invalid role: ${role}. Valid roles are: ${VALID_ROLES.join(', ')}`);
}

// ============================================================================
// ROLE PERMISSIONS
// ============================================================================

/**
 * Checks if a role has at least the permissions of another role
 * 
 * @param userRole - The user's role
 * @param requiredRole - The minimum required role
 * @returns True if user has sufficient permissions
 * 
 * @example
 * hasMinimumRole('admin', 'staff') // Returns true
 * hasMinimumRole('user', 'admin') // Returns false
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Checks if a role has a specific permission level
 * 
 * @param role - The role to check
 * @param level - The permission level (0-4)
 * @returns True if role has at least this level
 */
export function hasPermissionLevel(role: UserRole, level: number): boolean {
  return ROLE_HIERARCHY[role] >= level;
}

/**
 * Gets all roles that have at least the specified permission level
 * 
 * @param minLevel - Minimum permission level
 * @returns Array of roles with sufficient permissions
 */
export function getRolesWithLevel(minLevel: number): UserRole[] {
  return VALID_ROLES.filter(role => ROLE_HIERARCHY[role] >= minLevel);
}

// ============================================================================
// ROLE COMPARISON
// ============================================================================

/**
 * Compares two roles and returns their relationship
 * 
 * @param role1 - First role
 * @param role2 - Second role
 * @returns -1 if role1 < role2, 0 if equal, 1 if role1 > role2
 */
export function compareRoles(role1: UserRole, role2: UserRole): number {
  return ROLE_HIERARCHY[role1] - ROLE_HIERARCHY[role2];
}

/**
 * Gets the highest role from an array of roles
 * 
 * @param roles - Array of roles
 * @returns The role with highest permissions
 */
export function getHighestRole(roles: UserRole[]): UserRole {
  if (roles.length === 0) return 'guest';
  
  return roles.reduce((highest, current) => 
    ROLE_HIERARCHY[current] > ROLE_HIERARCHY[highest] ? current : highest
  );
}

// ============================================================================
// ROLE DISPLAY
// ============================================================================

/**
 * Gets a human-readable label for a role
 * 
 * @param role - The role
 * @returns Formatted role label
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    guest: 'Guest',
    user: 'User',
    admin: 'Administrator',
    staff: 'Staff Member',
    reviewer: 'Reviewer',
  };
  
  return labels[role] || role;
}

/**
 * Gets a description for a role
 * 
 * @param role - The role
 * @returns Role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    guest: 'Limited access, can view public content',
    user: 'Registered user, can submit forms and access user features',
    reviewer: 'Can review and moderate submissions',
    staff: 'Staff member with elevated permissions',
    admin: 'Full administrative access to all features',
  };
  
  return descriptions[role] || 'Unknown role';
}

