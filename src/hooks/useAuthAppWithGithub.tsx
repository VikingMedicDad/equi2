import { useCallback, useRef, useState } from "react";
import { MDCSwitchFoundation } from "@material/switch";
import { isEmpty } from "lodash";
import { gql, useMutation } from "@apollo/client";
import { formatError } from "util/error";
import * as models from "models";

import { useTracking } from "util/analytics";

type DType = {
  startAuthorizeAppWithGithub: models.AuthorizeAppWithGithubResult;
};

// eslint-disable-next-line
let triggerOnDone = () => {};
let triggerAuthFailed = () => {};

export type Props = {
  app: models.App ;
  onDone: () => void ;
};

function useAuthAppWithGithub({ app, onDone }: Props) {
  const [confirmRemove, setConfirmRemove] = useState<boolean>(false);
  const { trackEvent } = useTracking();

  const [authWithGithub, { loading, error }] = useMutation<DType>(
    START_AUTH_APP_WITH_GITHUB,
    {
      onCompleted: (data) => {

        openSignInWindow(
          data.startAuthorizeAppWithGithub.url,
          "auth with github"
        );
      },
    }
  );

  const [
    removeAuthWithGithub,
    { loading: removeLoading, error: removeError },
  ] = useMutation<{
    removeAuthorizeAppWithGithub: models.App;
  }>(REMOVE_AUTH_APP_WITH_GITHUB, {
    onCompleted: () => {
      onDone();
    },
  });

  const handleAuthWithGithubClick = useCallback(
    (data) => {
      if (isEmpty(app?.githubTokenCreatedDate)) {
        trackEvent({
          eventName: "startAuthAppWithGitHub",
        });
        authWithGithub({
          variables: {
            appId: app?.id,
          },
        }).catch(console.error);
      } else {
        setConfirmRemove(true);
      }
    },
    [authWithGithub, app, trackEvent]
  );

  const MDCSwitchRef = useRef<MDCSwitchFoundation>(null);
  const handleDismissRemove = useCallback(() => {
    setConfirmRemove(false);
    // `handleAuthWithGithubClick -> setConfirmRemove` is triggered by `Toggle.onValueChange`.
    // Behind the scenes, a `MDCSwitchFoundation.setChecked(false)` was triggered.
    // now that the toggle is cancelled, should explicitly call `MDCSwitchFoundation.setChecked(true)`.
    MDCSwitchRef.current?.setChecked(true);
  }, [setConfirmRemove, MDCSwitchRef]);

  const handleConfirmRemoveAuth = useCallback(() => {
    trackEvent({
      eventName: "removeAuthAppWithGitHub",
    });
    setConfirmRemove(false);
    removeAuthWithGithub({
      variables: {
        appId: app?.id,
      },
    }).catch(console.error);
  }, [removeAuthWithGithub, app, trackEvent]);
 
  triggerOnDone = () => {
    onDone();
  };
  
  const errorMessage = formatError(error || removeError);

  const isAuthenticatedWithGithub = !isEmpty(app.githubTokenCreatedDate);

  const result = {
    loading,
    isAuthenticatedWithGithub,
    removeLoading,
    confirmRemove,
    error,
    removeError,
    errorMessage,
    MDCSwitchRef,
    handleConfirmRemoveAuth,
    handleDismissRemove,
    handleAuthWithGithubClick,
  };

  return result;
}

export default useAuthAppWithGithub;

const START_AUTH_APP_WITH_GITHUB = gql`
  mutation startAuthorizeAppWithGithub($appId: String!) {
    startAuthorizeAppWithGithub(where: { id: $appId }) {
      url
    }
  }
`;

const REMOVE_AUTH_APP_WITH_GITHUB = gql`
  mutation removeAuthorizeAppWithGithub($appId: String!) {
    removeAuthorizeAppWithGithub(where: { id: $appId }) {
      id
      createdAt
      updatedAt
      name
      description
      color
      githubTokenCreatedDate
      githubSyncEnabled
      githubRepo
      githubLastSync
      githubLastMessage
    }
  }
`;

const receiveMessage = (event: any) => {
  const { data } = event;
  if (data.completed) {
    triggerOnDone();
  }
};

let windowObjectReference: any = null;

const openSignInWindow = (url: string, name: string) => {
  // remove any existing event listeners
  window.removeEventListener("message", receiveMessage);

  const width = 600;
  const height = 700;

  const left = (window.screen.width - width) / 2;
  const top = 100;

  // window features
  const strWindowFeatures = `toolbar=no, menubar=no, width=${width}, height=${height}, top=${top}, left=${left}`;

  windowObjectReference = window.open(url, name, strWindowFeatures);
  if (windowObjectReference) {
    windowObjectReference.focus();
  } else {
    triggerAuthFailed();
  }

  // add the listener for receiving a message from the popup
  window.addEventListener("message", (event) => receiveMessage(event), false);
};
