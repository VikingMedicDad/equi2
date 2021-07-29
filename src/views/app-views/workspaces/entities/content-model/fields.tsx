import React, { useEffect, useMemo } from 'react';
import { Table, Tag, PageHeader, message, Divider, Avatar} from 'antd';
import Icon from '@components/util-components/Icon';
import {    TagTwoTone , 
            EditOutlined,
            DeleteOutlined,
            TeamOutlined,
            UserOutlined,
            UnlockOutlined,
            ClockCircleOutlined,
            FontSizeOutlined,
            AlignLeftOutlined,
            CalendarOutlined,
            FieldBinaryOutlined,
            NumberOutlined,
            LinkOutlined,
            MailOutlined,
            BarcodeOutlined,
            EnvironmentOutlined,
            CheckSquareOutlined,
            HistoryOutlined,
            TableOutlined,
            TagOutlined,
            TagsOutlined,
            FlagOutlined
    } from '@ant-design/icons';
import useEntityFieldList from "@hooks/useEntityFieldList";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "@amp-components/Entity/constants";

const createTypeIcon = (field:any) => {
    switch(field.icon){
        case "type": return (
            FontSizeOutlined
        );
        case "multiline_text": return (
            AlignLeftOutlined 
        );
        case "at_sign": return (
            MailOutlined
        );
        case "bookmark": return (
            FieldBinaryOutlined
        );
        case "decimal_number": return (
            NumberOutlined 
        );
        case "calendar": return (
            CalendarOutlined
        );
        case "lookup": return (
            LinkOutlined 
        );
        case "check_square": return (
            CheckSquareOutlined
        );
        case "code1": return (
            FlagOutlined
        );
        case "option_set": return (
            TagOutlined
        );
        case "multi_select_option_set": return (
            TagsOutlined
        );
        case "map_pin": return (
            EnvironmentOutlined
        );
        case "created_at": return (
            ClockCircleOutlined
        );
        case "updated_at": return (
            HistoryOutlined
        );
        case "id": return (
            BarcodeOutlined
        );
        case "user": return (
            UserOutlined
        );
        case "lock": return (
            UnlockOutlined
        );
        case "users": return (
            TeamOutlined 
        );
        default: return (
            TableOutlined               
        );
    }
}

const getIcon = (field:any) => {
    return (
        <>
            <Avatar shape="square" style={{
                background: `${field.color}`
            }} icon={ <Icon className="h4 text-white" type={createTypeIcon(field)} />} />
        </>
    );
}

const getTags = (tags:[]) => {
    return (
        <span>
            {tags.map((tag:any) => {
            
            let color = tag === 'required' ? 'magenta' : 'geekblue';
            
            return (
                <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                </Tag>
            );
            })}
        </span>
    );
}

const columns = [
{
    title: 'Icon',
    dataIndex: 'icon',
    key: 'icon',
    render: (icon:any) => getIcon(icon),
},
{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
},
{
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type:any) => <b>{type.label}</b>
},
{
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags:any) => getTags(tags),
},
{
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
},
{
    title: 'Action',
    key: 'action',
    render: (text:any, record:any) => (
    <span>
        <EditOutlined />
        <Divider type="vertical" />
        <DeleteOutlined />
    </span>
    ),
},
];

const Fields = ({entityId}:any) => {
    const {
        data,
        loading,
        error,
        errorMessage,
        // entityIdToName,
        // setError,
    } = useEntityFieldList({ entityId });

    const getTags = (field:any) => {
        const result = [];
        if(field.required)
          result.push('required');
        if(field.searchable)
          result.push('searchable');
        return result;
    }

    const mappingEntityFields = useMemo (() => {
        
        if (!data?.entity.fields) 
            return [];

        return data?.entity.fields.map((field) => {
            return{
                'key':            field.id,
                'icon':           DATA_TYPE_TO_LABEL_AND_ICON[field.dataType],
                'type':           DATA_TYPE_TO_LABEL_AND_ICON[field.dataType],
                'name':           field.displayName,
                'description':    field.description,
                'tags':           getTags(field)
            }
        });

    }, [data]);

    let dynamicData:any[] = [];

    if(mappingEntityFields){
        dynamicData = mappingEntityFields;
    }

    useEffect(() => {
        if(error){
            message.error(errorMessage);
        }
    }, [error, errorMessage]);    

	return (
        <>
            <PageHeader
                className="site-section-header"
                title={<h3 className="mb-4"><TagTwoTone  twoToneColor="#52c41a"/> Fields {dynamicData.length} </h3>}
            />
            <Table  
                size="large" 
                loading={loading && !!mappingEntityFields} 
                pagination={false} 
                bordered={false} 
                showHeader={false} 
                columns={columns}
                tableLayout="auto"
                dataSource={dynamicData}
            />
        </>
	)
}

export default Fields
