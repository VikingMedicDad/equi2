import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import { Steps, Tabs, Card, message } from 'antd';
import PendingChanges from '@amp-components/VersionControl/PendingChanges';
import { Radio, Row, Timeline, Col, Spin, Tag, Typography} from 'antd';
import { CaretUpOutlined, ClockCircleOutlined, DiffFilled, SplitCellsOutlined  } from '@ant-design/icons';
import { getLSCurrentApplication } from "@hooks/useApplicationSelector";
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import useCommitList from "@hooks/useCommitList";
import './Stage.scss';
import utils from 'utils';
import PendingChangeCompareList from '@amp-components/VersionControl/PendingChangeCompareList';


const { Step } = Steps;
const { TabPane } = Tabs;
const { Text } = Typography;

const Stage = () => {
	const [view, setView] = useState(false);
	const applicationId = getLSCurrentApplication();

	const {
		data,
		loading,
		error,
		errorMessage,
	} = useCommitList();

	const onChangeProjectView = e => {
		setView(e.target.value)
	}

	useEffect(() => {
	if(error){
		message.error(errorMessage);
	}
	}, [error, errorMessage]);

	return (
		<div>
			<div className="container">
			<Tabs defaultActiveKey="1" style={{marginTop: 30}}>
				<TabPane tab="Pending changes" key="1">
					<Card
						actions={
							[
								<div className='my-4 container container-fluid'>
									<Steps progressDot current={0}>
										<Step title="Stage" 	description="recent changes" />
										<Step title="Compare" description="previous version"  />
										<Step title="Verify" 	description="latest updates" />
									</Steps>
								</div>
								
							]
						}
						className="ant-with-height"
					>
						<div className='my-4 container container-fluid stage-content'>
							<PendingChanges applicationId={applicationId} />
						</div>
					</Card>
					
				</TabPane>
				<TabPane tab="Compare changes" key="2">
					<Card
							title={
								<div>
									<Radio.Group defaultValue={false} onChange={e => onChangeProjectView(e)}>
										<Radio.Button value={false}><DiffFilled /></Radio.Button>
										<Radio.Button value={true}><SplitCellsOutlined /></Radio.Button>
									</Radio.Group>
								</div>
							}
							actions={
								[
									<div className='my-4 container-fluid'>
										<Steps progressDot current={1}>
											<Step title="Stage" 	description="recent changes" />
											<Step title="Compare" description="previous version"  />
											<Step title="Verify" 	description="latest updates" />
										</Steps>
									</div>
								]
							}
						className="ant-with-height"
						>
							<div className='container-fluid stage-content'>
							{
								<PendingChangeCompareList applicationId={applicationId} splitView={view} />
							}
							</div>
					</Card>
						
				</TabPane>
				<TabPane tab="Commit history" key="3">
					<Card
						actions={
							[
								<div className='my-4 container container-fluid'>
									<Steps progressDot current={2}>
										<Step title="Stage" 	description="recent changes" />
										<Step title="Compare" description="previous version" />
										<Step title="Verify" 	description="latest updates" />
									</Steps>
								</div>
							]
						}
						className="ant-with-height"
					>
						<div className='my-4 container stage-content'>
							<Row>
								<Col span={22}>
								<Timeline mode="alternate">
								{loading && <Spin />}
									<Timeline.Item 
										color="blue" 
										dot={<CaretUpOutlined 
										style={{ fontSize: '22px' }} 
									/>}>Most recent commit
									</Timeline.Item>
									{data?.commits.map((commit) => (
										<Timeline.Item 
											key={commit.id} 
											color="blue">
												<p>
													<Link to={`${APP_PREFIX_PATH}/version/commits/${commit.id}`} ><Tag color="volcano">{commit.id}</Tag></Link>
												</p>
												<p>
													<Tag  color="geekblue"><ClockCircleOutlined /><span>by {commit.user?.account?.firstName} </span> {utils.formatTimeToNow(commit.createdAt)}</Tag>
												</p>
												<p className="container p-2">
													<Text type="secondary">{commit.message?commit.message:'No Commit Message'}</Text>
												</p>
												
										</Timeline.Item>
									))}
									</Timeline>
								</Col>
							</Row>
						</div>
					</Card>
				</TabPane>
			</Tabs>
			</div>
		</div>
	)
}

export default Stage
