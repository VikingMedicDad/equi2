import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Spin, Empty, Typography, Button, PageHeader, Tag, message, Modal } from 'antd';
import { ApiFilled, PlusSquareOutlined } from "@ant-design/icons";
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import useApiTokenList from "@hooks/useApiTokenList";
import NewApiToken from "./new";
import ApiTokenListItem from "./item";
import './Token.scss';

const {Text} =  Typography ;

const Tokens = React.memo(() => {

	const [confirmLoading, setConfirmLoading] = useState(false);

	const {
		loading,
		data,
		newToken,
		newTokenState,
		error,
		errorMessage,
		setError,
		handleNewTokenClick,
		handleNewTokenCompleted
	  } = useApiTokenList();
	
	useEffect(() => {
		if(error){
			message.error(errorMessage);
		}
	}, [error, errorMessage]);

	const handleOk = () => {
		setConfirmLoading(true);
		setTimeout(() => {
		}, 1000);
	};
	
	const handleCancel = () => {
		handleNewTokenClick();
	};

	return (
		<>
			<Modal
				title="Generate new Token"
				visible={newTokenState}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				footer={null}
			>
				<NewApiToken onCompleted={handleNewTokenCompleted} />
			</Modal>

			<PageHeader
				className="site-page-header"
				tags={[
						<Tag color="gold" >
							<sup>*</sup>Tokens are valid for 30 days from creation or last use, so that the 30
							day expiration automatically refreshes with each API call.
						</Tag>,
						newToken && (<Tag color="magenta" ><sup>**</sup>Make sure to copy your new API token now. You won't be able to see it again.</Tag>)
					
				]}
				title={<h3 className=""><ApiFilled /> Manage API tokens </h3>}
				footer={
					<>
						<Text type="secondary">API Tokens are used to authenticate requests to Equilibrium API,
							specifically it is required to use <Link to={`${APP_PREFIX_PATH}/console/cli`}>Equilibrium CLI</Link> or to connect Equilibrium from your preferred console terminal.</Text>
					</>
				}
				extra={
					<Button
						type="primary"
						icon={ <PlusSquareOutlined />}
						onClick={handleNewTokenClick}
						>
						Generate Token
					</Button>
				}

			/>
			
			<div className="mt-3 api-token-container">
			{loading && <Spin />}
			{
				data?.userApiTokens.length>0 ? (
					data.userApiTokens.map((token) => (
						<ApiTokenListItem
							key={token.id}
							apiToken={token}
							onError={setError}
						/>
					))
				):(
					<Empty 
						image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
						description={
							<span>
								Create your first token
							</span>
						}
					/>
				)
			}
			</div>
		</>
	)
});

export default Tokens
