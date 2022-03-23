export interface ResolverContext {
  sub: string;
  iss: string;
  emailAddress: string;
}

export enum AwsAccount {
  'workshop-engine-prod' = '091964112581'
}

export enum OrganizationalUnit {
  Workshops = 'ou-13ix-xh9z7807',
  'Workshop Accounts' = 'ou-13ix-6tkkmwja'
}

export enum Owner {
  superluminar = 'superluminar'
}

export const workshopAttendeeRoleName = 'WorkshopAttendee';
