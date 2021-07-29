import { useCallback } from "react";
import { useTracking } from "util/analytics";

const useSupportMenu = () => {
  const { trackEvent } = useTracking();

  const handleDocsClick = useCallback(() => {
    trackEvent({
      eventName: "supportDocsClick",
    });
  }, [trackEvent]);

  const handleCommunityClick = useCallback(() => {
    trackEvent({
      eventName: "supportCommunityClick",
    });
  }, [trackEvent]);

  const handleFeatureRequestClick = useCallback(() => {
    trackEvent({
      eventName: "supportFeatureRequestClick",
    });
  }, [trackEvent]);

  const handleIssueClick = useCallback(() => {
    trackEvent({
      eventName: "supportIssueClick",
    });
  }, [trackEvent]);

  const result = {
    handleDocsClick,
    handleCommunityClick,
    handleIssueClick,
    handleFeatureRequestClick
  };

  return result;
};

export default useSupportMenu;
