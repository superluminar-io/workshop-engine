import clerk from '@clerk/clerk-sdk-node';
import { ResolverContext, UserRole } from '../config';

const acceptInvitationQuery = 'mutation AcceptInvitation($inviteId: ID!, $emailAddress: String!) {\n  acceptInvitation(inviteId: $inviteId, emailAddress: $emailAddress) {\n    ok\n    __typename\n  }\n}';

export const handler: AWSLambda.AppSyncAuthorizerHandler<ResolverContext> = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  if (event.requestContext.queryString === acceptInvitationQuery) {
    return {
      isAuthorized: true,
    };
  }

  try {
    const token = event.authorizationToken.split('Bearer ')[1];
    const jwt = await clerk.verifyToken(token);
    const user = await clerk.users.getUser(jwt.sub);
    const emailAddress = user.emailAddresses[0].emailAddress!;

    return {
      isAuthorized: true,
      resolverContext: {
        sub: jwt.sub,
        iss: jwt.iss,
        emailAddress,
        role: user.privateMetadata.role || UserRole.ATTENDEE,
      },
    };
  } catch (error) {
    console.log(`Error: ${error}`);

    return {
      isAuthorized: false,
    };
  }
};
