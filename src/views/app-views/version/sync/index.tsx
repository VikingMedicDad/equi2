import React, {useEffect} from "react";
import { message , Empty } from "antd";
import useSyncWithGithubPage from "@hooks/useSyncWithGithubPage";
import AuthAppWithGithub from "@amp-components/VersionControl/AuthAppWithGithub";

const Sync = () => {
	let {
		data,
		error,
		errorMessage,
		refetch
	  } = useSyncWithGithubPage();

	  useEffect(() => {
		if(error){
		  message.error(errorMessage);
		}
	  }, [error, errorMessage]);

	  return (
		  <>
		  	{data?.app ? (
				<AuthAppWithGithub app={data.app} onDone={refetch} />):(
				<Empty 
				  image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
				  description={
					  <span>
						  GitHub data are not avalaible. Please check your app settings
					  </span>
				  }
			  />
			  )}
		  </>
	  );
}

export default Sync
