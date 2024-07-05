import { stackMiddlewares } from "./middlewares/stackMiddlewares";
import { withAuthentication } from "./middlewares/withAuthentication";
import { withAuthorizationAdminOnly } from "./middlewares/withAuthorizationAdminOnly";
import { withEnableDeletion } from "./middlewares/withEnableDeletion";
import { withEnableOptionsResponse } from "./middlewares/withEnableOptionsResponseOK";

export default stackMiddlewares([
  withEnableOptionsResponse,
  withEnableDeletion,
  withAuthentication,
  withAuthorizationAdminOnly,
]);
