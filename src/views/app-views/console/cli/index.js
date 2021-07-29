import React from 'react';
import { Link } from "react-router-dom";
import { Typography, PageHeader } from 'antd';
import { CodeOutlined } from "@ant-design/icons";
import { APP_PREFIX_PATH } from 'configs/AppConfig';

const {Text} =  Typography ;


const ConsoleCli = () => {
	return (
		<>
			<PageHeader
				className="site-page-header"
				footer={[
						<Text color="geekblue" ><sup>*</sup>API Tokens are used to authenticate requests to Equilibrium API. Connect to your CLI by using API Tokens generated from 
						<Link to={`${APP_PREFIX_PATH}/settings/api-tokens`}> Settings/API Tokens.</Link></Text>
				]}
				title={<h3 className=""><CodeOutlined /> Command Line Interface </h3>}
			/>
		</>
	)
}

export default ConsoleCli
