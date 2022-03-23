import clerk from '@clerk/clerk-sdk-node';
import { ResolverContext } from '../config';

export const handler: AWSLambda.AppSyncAuthorizerHandler<ResolverContext> = async (event) => {
  console.log(`Event: ${JSON.stringify(event)}`);

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
      },
    };
  } catch (error) {
    console.log(`Error: ${error}`);

    return {
      isAuthorized: false,
    };
  }
};
