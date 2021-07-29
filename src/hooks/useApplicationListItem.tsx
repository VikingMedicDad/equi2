import { useCallback } from "react";
import { useTracking } from "util/analytics";

import * as models from "models";

export type Props = {
  app: models.App;
};

function useApplicationListItem({ app }: Props) {
  const { trackEvent } = useTracking();

  const handleClick = useCallback(() => {
    trackEvent({
      eventName: "applicationCardClick",
    });
  }, [trackEvent]);

  const lastBuildDate = app.builds[0]
    ? new Date(app.builds[0].createdAt)
    : undefined;

  const result = {
    lastBuildDate,
    handleClick
  };

  return result;
}

export default useApplicationListItem;
