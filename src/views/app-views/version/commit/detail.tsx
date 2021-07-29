import React, {useState} from 'react'
import { DiffFilled, SplitCellsOutlined } from '@ant-design/icons';

import { Card, Radio} from 'antd';
import CommitCompareList from '@amp-components/VersionControl/CommitCompareList';


const Detail = ({match}:any) => {

	const [view, setView] = useState(false);

	const { commitId } = match.params;

	const onChangeProjectView = (e:any) => {
		setView(e.target.value)
	}

	return (
		<Card
				title={
					<div>
						<Radio.Group defaultValue={false} onChange={e => onChangeProjectView(e)}>
							<Radio.Button value={false}><DiffFilled /></Radio.Button>
							<Radio.Button value={true}><SplitCellsOutlined /></Radio.Button>
						</Radio.Group>
					</div>
				}
			>
				<div className='container-fluid'>
				{
					<CommitCompareList commitId={commitId} splitView={view}/>
				}
				</div>
		</Card>
	)
}

export default Detail
