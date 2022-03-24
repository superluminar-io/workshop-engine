import clerk from '@clerk/clerk-sdk-node';
import { UserRole } from '../config';

interface Event {
  userEmailAddresses: string[];
}

export const handler = async (event: Event) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  await Promise.all(event.userEmailAddresses.map(
    userEmailAddress => {
      return clerk.users.createUser({
        emailAddress: [
          userEmailAddress,
        ],
        privateMetadata: {
          role: UserRole.ATTENDEE,
        },
      });
    },
  ));
};
