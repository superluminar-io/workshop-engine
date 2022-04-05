export interface ResolverContext {
  sub: string;
  iss: string;
  emailAddress: string;
}

export enum AwsAccount {
  'workshop-engine-staging' = '203864079770',
  'workshop-engine-prod' = '091964112581'
}

export enum OrganizationalUnit {
  Workshops = 'ou-13ix-xh9z7807',
  'Workshop Accounts Staging' = 'ou-13ix-nx9crx8v',
  'Workshop Accounts Prod' = 'ou-13ix-dikqjh01'
}

export enum Owner {
  superluminar = 'superluminar'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  ATTENDEE = 'ATTENDEE'
}

export const workshopAttendeeRoleName = 'WorkshopAttendee';
