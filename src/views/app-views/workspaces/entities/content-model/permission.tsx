import React, { Component } from 'react';
import { List, Switch, PageHeader} from 'antd';
import { 
	EyeOutlined, 
	AppstoreAddOutlined, 
	DeleteOutlined,
	EditOutlined,
	FileSearchOutlined,
	SafetyCertificateTwoTone
} from '@ant-design/icons';
import Icon from 'components/util-components/Icon';
import Flex from 'components/shared-components/Flex';


export class Permission extends Component {

	state ={
		config: [
			{
				key: 'key-mentions',
				title: 'View',
				icon: EyeOutlined ,
				desc: 'All roles selected. Set specific permissions to special fields',
				allow: false
			},
			{
				key: 'key-follows',
				title: 'Create',
				icon: AppstoreAddOutlined ,
				desc: 'All roles selected. Set specific permissions to special fields',
				allow: true
			},
			{
				key: 'key-comment',
				title: 'Update',
				icon: EditOutlined ,
				desc: 'All roles selected. Set specific permissions to special fields',
				allow: true
			},
			{
				key: 'key-email',
				title: 'Delete',
				icon: DeleteOutlined,
				desc: 'All roles selected. Set specific permissions to special fields',
				allow: false
			},
			{
				key: 'key-product',
				title: 'Search',
				icon: FileSearchOutlined,
				desc: 'All roles selected. Set specific permissions to special fields',
				allow: true
			}
		]
	}

	render() {
		const { config } = this.state;
		return (
			<>
				<PageHeader
					className="site-page-header"
					title={<h3 className="mb-4"><SafetyCertificateTwoTone twoToneColor="#52c41a"/> Permissions</h3>}
				/>
				<List
					itemLayout="horizontal"
					dataSource={config}
					size="small"
					renderItem={item => (
						<List.Item>
							<Flex justifyContent="between" alignItems="center" className="w-100">
								<div className="d-flex align-items-center">
									<Icon className="h1 mb-0 text-primary" type={item.icon} />
									<div className="ml-3">
										<h5 className="mb-0">{item.title}</h5>
										<p>{item.desc} <a href='/app/settings/permissions'>here</a></p>
									</div>
								</div>
								<div className="ml-3">
									<Switch defaultChecked={item.allow} onChange={
										checked => {
											const checkedItem = config.map( elm => {
												if(elm.key === item.key) {
													elm.allow = checked
												}
												return elm
											})
											this.setState({
												config:[
													...checkedItem
												]
											})
										}
									} />
								</div>
							</Flex>
						</List.Item>
					)}
				/>
			</>
		)
	}
}

export default Permission
