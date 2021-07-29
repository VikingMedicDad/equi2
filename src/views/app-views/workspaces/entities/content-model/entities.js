import React from 'react'
import { Empty } from 'antd';


const Entities = () => {

	return (
        <Empty 
            image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
            description={
                <span>
                    Please select your entity.
                </span>
            }
        />
	)
}

export default Entities
