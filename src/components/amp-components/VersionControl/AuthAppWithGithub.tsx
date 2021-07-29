import React, {useEffect, useState, useCallback} from "react";
import { message, Skeleton, Card, Avatar, Col, List, Button, Switch } from "antd";
import { isEmpty } from "lodash";
import { Steps, Typography, Row, Tag, Modal } from 'antd';
import { 
	GithubOutlined,
	GithubFilled,
	BookOutlined,
	SyncOutlined,
	CheckOutlined,
	CloseOutlined
} from '@ant-design/icons';
import useAuthAppWithGithub, {Props} from "@hooks/useAuthAppWithGithub";
import GithubRepos from "@amp-components/VersionControl/GithubRepos";

const { Step } = Steps;
const { Text } = Typography;
const { Meta } = Card;
const { confirm } = Modal;

const AuthAppWithGithub = ({ app, onDone }: Props) => {
	
	const [currentStep, setCurrentStep] = useState<number>(0);

	const {
		loading,
		isAuthenticatedWithGithub,
		removeLoading,
		confirmRemove,
		error,
		removeError,
		errorMessage,
		handleConfirmRemoveAuth,
		handleDismissRemove,
		handleAuthWithGithubClick,
	} = useAuthAppWithGithub({app, onDone});

	useEffect(() =>{
		if(isAuthenticatedWithGithub){
			setCurrentStep(1);
			if(app.githubSyncEnabled){
				setCurrentStep(2);
			}
		}

	}, [isAuthenticatedWithGithub, app.githubSyncEnabled])

	useEffect(() => {
		if(error || removeError){
			message.error(errorMessage);
		}
	}, [error, removeError, errorMessage]);
	
	const disableSyncModal = useCallback(() => {
		confirm({
			title: 'Disable Sync with GitHub',
			content: 'Are you sure you want to disable sync with GitHub?',
			onOk() {
			return new Promise((resolve, reject) => {
				setTimeout(() =>{
					handleConfirmRemoveAuth();
					return resolve();
				}, 500);
			}).catch(() => console.log('Error during discard'));
			},
			onCancel() {
				handleDismissRemove();
			},
		});
	}, [handleConfirmRemoveAuth, handleDismissRemove]);

	useEffect(() => {
		if(confirmRemove){
			disableSyncModal();
		}
	}, [confirmRemove, disableSyncModal]);

	const notice = [
	{
		title:<h5>Notice:</h5>
	},
	{
		title: <Tag><Text  ><sup>*</sup>The changes will be pushed to the root of the selected repository, using Pull Requests.</Text></Tag> ,
	},
	{
		title: <Tag><Text type="danger"><sup>**</sup>The selected repository must not be empty, so please create at least one file in the root.</Text></Tag> ,
	},
	{
		title: <Tag><Text  strong>Initialize this repository with a README file to make sure it is not empty.</Text></Tag> 
	}
	];

	return (
	<Row>
		<Steps direction="vertical" 
				current={currentStep} 
				size="default" 
				className="mb-4"
			>
			<Step
				className="mb-4" 
				title={
					<h4>Enable sync with Github</h4>
				} 
				icon={<GithubOutlined /> }	
				description={
					<>
						<Row>
							<Text type="secondary" className="mb-3" >
								Enable sync with GitHub to automatically push the generated code of
								your application and create a Pull Request in your GitHub repository
								every time you commit your changes.<sup>*</sup>
							</Text>
						</Row>
						<Row>
							<Switch
								checkedChildren={<CheckOutlined />}
								unCheckedChildren={<CloseOutlined />}
								size="default"
								checked={isAuthenticatedWithGithub}
								disabled={loading || removeLoading || isEmpty(app)}
								loading={loading || removeLoading}
								onChange={handleAuthWithGithubClick}
							/>
						</Row>
					</>
				} 
			/>
			<Step 
				className="mb-4"
				title={
				<h4>Select your Github repository</h4>
			} icon={<BookOutlined />}	description={
				<>
					{!isAuthenticatedWithGithub?(
						<Row>
							<Col span={6}>
								<Card
									style={{ width: 300, marginTop: 16 }}
									>
									<Skeleton loading={true} avatar active>
										<Meta
										avatar={
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
										}
										title="Card title"
										description="This is the description"
										/>
									</Skeleton>
								</Card>
							</Col>
							<Col span={6}>
								<Card
									style={{ width: 300, marginTop: 16 }}
									
									>
									<Skeleton loading={true} avatar active>
										<Meta
										avatar={
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
										}
										title="Card title"
										description="This is the description"
										/>
									</Skeleton>
								</Card>
							</Col>
							<Col span={6}>
								<Card
									style={{ width: 300, marginTop: 16 }}
									>
									<Skeleton loading={true} avatar active>
										<Meta
										avatar={
											<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
										}
										title="Card title"
										description="This is the description"
										/>
									</Skeleton>
								</Card>
							</Col>
						</Row>
					):(
						<>
							<Row>
								<GithubRepos  	
									app={app}
									isAuthenticatedWithGithub 
								/>
							</Row>
						</>
					)}
					
				</>
			}  />
			
			<Step icon={<SyncOutlined />} className="mb-4" title={
				<h4>Synchronize your changes with GitHub.</h4>
			} description={

				<>
					<Col span={8} className="mb-4">
						<Button href={`https://github.com/${app.githubRepo}`} target="_blank" block icon={<GithubFilled />} size="large" disabled={!app.githubSyncEnabled}>
							Open GitHub
						</Button>
					</Col>
					<List
						size="large"
						bordered = {false}
						dataSource={notice}
						renderItem={item => <List.Item>{item.title}</List.Item>}
					/>
				</>
			} />
		</Steps>
	
	</Row>

	);
}

export default AuthAppWithGithub