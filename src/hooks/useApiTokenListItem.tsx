import { isEmpty } from "lodash";
import { addDays, differenceInDays } from "date-fns";

const EXPIRATION_DAYS = 30;

const useApiTokenListItem = ({
  apiToken
}: any) => {

  const expirationDate = addDays(
    new Date(apiToken.lastAccessAt),
    EXPIRATION_DAYS
  );
  
  const expired = differenceInDays(new Date(), expirationDate) > 0;
  const newToken = !isEmpty(apiToken.token);
  const createdDate = new Date(apiToken.createdAt);

  const result = {
    newToken,
    expired,
    createdDate,
    expirationDate
  };

  return result;
};

export default useApiTokenListItem;