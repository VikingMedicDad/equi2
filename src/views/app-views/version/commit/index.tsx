import React, { Component, useEffect, useState } from 'react'
import { HistoryOutlined , ClockCircleOutlined, CaretUpOutlined} from '@ant-design/icons';
import { Timeline, Col, Row, message, Menu, Input, Spin, Tag, Card, Typography} from 'antd';
import { Redirect, Route, Switch, Link} from 'react-router-dom';
import InnerAppLayout from 'layouts/inner-app-layout';
import Detail from './detail';
import Commit from './commit';
import useCommitList from "@hooks/useCommitList";
import utils from 'utils';

const { Text } = Typography;
const CLASS_NAME = "commit-list";
  
const CommitOption = ({ match, location }: any) => {

	const [commitId, setCommitId] = useState("");

	const {
		data,
		loading,
		error,
		errorMessage,
		handleSearchChange
	  } = useCommitList();

	const searchOnChange = (e:any) => {
		const query = e.target.value;
		handleSearchChange(query);
	}

	useEffect(() => {
	if(error){
		message.error(errorMessage);
	}
	}, [error, errorMessage]);

	useEffect(() => {

		if(location.pathname){
			const id = location.pathname.split("/").pop();
			setCommitId(id)
		}
	}, [location.pathname]);

	return (
		<div className="container p-4">
			<h4 className="text-primary"><HistoryOutlined /> History</h4>
			<Row>
				<Col span={22}>
					<Menu
							mode="vertical-right"
							className="mb-5"
							style={{width: 500}}
						>
						<Menu.ItemGroup key="filter-group" title={(
							<Row className={`${CLASS_NAME}__group-title`} align="middle">
								<Col span={15}>Filter commits</Col>
								<Col span={4}><Tag color="volcano"> {data?.commits?.length}</Tag></Col>
							</Row>
						)} >
							<Row className={`${CLASS_NAME}__group-title`} align="middle">
								<Col span={24} offset={1}>
									<Input 
										placeholder="Search by commit message..." 
										bordered={false}
										size="small"
										onChange={searchOnChange}
									/>
								</Col>
							</Row>
							
						</Menu.ItemGroup>
						</Menu>
				</Col>
			</Row>
			
			
			<Row>
				<Col span={22}>
				<Timeline mode="left">
				{loading && <Spin />}
					<Timeline.Item 
						color="blue" 
						dot={<CaretUpOutlined 
						style={{ fontSize: '22px' }} 
					/>}>
						Most recent commit
					</Timeline.Item>
					
					{data?.commits.map((commit) => (
						<Timeline.Item 
							key={commit.id} 
							dot=
							{
								commitId === commit.id ? (<ClockCircleOutlined style={{fontSize:30}} />) : ''
							}
							color=
							{
								commitId === commit.id ? 'blue': 'gray'
							}
						>
								<Link to={commit.id} >
								<Card
									size={
										commitId === commit.id ? 'default': 'small'
									}
									
									title={[
										<></>,
										<Tag color="volcano">{commit.id}</Tag>,
									]}
									bordered={commitId === commit.id}
									onClick={()=>{setCommitId(commit.id)}}
								>
									
									<Tag  color="geekblue"><ClockCircleOutlined /><span>by {commit.user?.account?.firstName} </span> {utils.formatTimeToNow(commit.createdAt)}</Tag>
									<p className="container p-2">
										<Text type="secondary">{commit.message?commit.message:'No Commit Message'}</Text>
									</p>
									
								</Card>
								</Link>
								
						</Timeline.Item>
					))}
					</Timeline>
				</Col>
			</Row>
		</div>
	  );
};

const CommitContent = ({ match }: any) => {
	return (
		<Switch>
			<Redirect exact from={`${match.url}`} to={`${match.url}/version`} />
			<Redirect exact from={`${match.url}/version/:commitId`} to={`${match.url}/:commitId`} />
			<Route path={`${match.url}/version`} component={Commit} />
			<Route path={`${match.url}/:commitId`} component={Detail} />
		</Switch>
	)
}

export class CommitPage extends Component {
	
	render() {
		return (
			<InnerAppLayout 
				pageHeader={false}
				sideContentWidth={500}
				sideContent={<CommitOption {...this.props}/>}
				mainContent={<CommitContent {...this.props}/>}
			/>
		);
	}
}

export default CommitPage