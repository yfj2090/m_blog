import React, { useState, useEffect } from 'react'
import style from './index.module.scss'

import { DeleteOutlined } from '@ant-design/icons'
import { Input, Checkbox, Button, Row, Col, Space } from 'antd' 

const TodoList = () => {
    // Input Value
    const [inpValue, setInpValue] = useState('')
    // TodoList 内容
    const [content, setContent] = useState([])
    // TodoList Status Toggle => all, finish&&unfinish, clearFinish
    const [showStatus, setShowStatus] = useState('all')
    // 剩余任务数量
    const [contentleft, setContentLeft] = useState(0)
    // Footer 状态 => all, finish, unfinish, clearFinish
    const [status, setStatus] = useState('all')

    useEffect(() => {
        if (content.length) {
            // 计算剩余任务数量
            let num = 0
            content.forEach(item => {
                if (!item.isfinish) {
                    num++
                }
            })
            setContentLeft(num)

            judgeFooterStatus()
        }
    }, [content])

    // 判断 Footer Status 显隐状态
    const judgeFooterStatus = () => {
        if (content.some(item => item.isfinish !== content[0].isfinish)) {
            setShowStatus('finish&&unfinish')
        } else if (content.every(item => item.isfinish === true)) {
            changeStatus('clearFinish', 'all')
        } else {
            changeStatus()
        }
    }

    // change status
    const changeStatus = (showStatus = 'all', status = 'all') => {
        setStatus(status)
        setShowStatus(showStatus)
    }

    // Item operate
    const operateItem = (type, id, isfinish) => {
        const contentCopy = [...content]
        contentCopy.forEach((v,i) => {
            // select checkbox
            if (type === 'select' && v.id === id) {
                v.isfinish = isfinish
            }
            // delete item
            if (type === 'delete' && v.id === id) {
                contentCopy.splice(i, 1)
            }
        })
        judgeFooterStatus()
        setContent(contentCopy)
    }

    // Submit
    const submit = (value) => {
        if (!value) return
        let item = {
            id: '',
            name: '',
            isfinish: false
        }
        item.id = new Date().getTime()
        item.name = value
        
        setContent([...content, item])
        
        // // 提交成功后，删除input的数据
        setInpValue('')
    }

    // TodoItemStatus
    const TodoItemStatus = () => {
        switch(status) {
            case 'all':
            case 'clearFinish':
                const funcItem = item => <TodoItem key={item.id} item={item} operateItem={operateItem}/>
                return content.map(funcItem)
            case 'unfinish':
                const itemUnFinish = item => !item.isfinish ? <TodoItem key={item.id} item={item} operateItem={operateItem}/> : null
                return content.map(itemUnFinish)
            case 'finish':
                const itemFinish = item => item.isfinish ? <TodoItem key={item.id} item={item} operateItem={operateItem}/> : null
                return content.map(itemFinish)
            default: break;
        }
    }

    // onClick Footer Status
    const statusToggle = (type) => {
        setStatus(type)
        if (type === 'clearFinish') {
            clearFinish()
        }
    }
    
    // clear finish task
    const clearFinish = () => {
        let arr = []
        content.forEach(item => {
            if (!item.isfinish) {
                arr.push(item)
            }
        })
        setContent(arr)
        changeStatus()
    }

    return (
        <div className={style.todoList}>
            <div className={style.todoListTitle}>TodoList Demo</div>
            <div className={style.todoListInput}>
                    <Input.Search
                        value={inpValue}
                        enterButton="Submit"
                        onSearch={v => submit(v)}
                        onChange={e => setInpValue(e.target.value)}
                        placeholder="Input Task"
                    />
            </div>
            {
                // Content
                content.length ? 
                <div className='content'>
                    {
                        TodoItemStatus()
                    }
                </div>
                : null
            }
            {   
                // Footer
                content.length ?
                <div className={style.todoListFooter}>
                    <TodoFooterStatus status={status} statusToggle={statusToggle} contentleft={contentleft}  showStatus={showStatus}/>
                </div>
                :
                null
            }
        </div>
    )
}

const TodoItem = (props) => {
    const { id, name, isfinish } = props.item
    const { operateItem } = props
    return (
        <div className={style.todoItem}>
            <Checkbox checked={isfinish} onChange={(e) => { operateItem('select', id, e.target.checked) }}>
            {
                isfinish ? <span><del>{name}</del></span> : <span>{name}</span>
            }
            </Checkbox>
            <Button className={style.todoItemDelete} type="link" onClick={() => { operateItem('delete', id) }}>
                <DeleteOutlined />
            </Button>
        </div>
    )
}

const TodoFooterStatus = (props) => {
    const { status, statusToggle, showStatus, contentleft } = props
    // 判断 status css active
    const styleStatus = (type) => status === type ? 'link' : 'text'
    return (
        <Row>
            <Col flex='100px'>
                <Button type="text">{`剩余 ${ contentleft } 个项目`}</Button>
            </Col>
            <Col flex='auto'>
                <Space size={0}>
                    <Button type={styleStatus('all')} onClick={() => statusToggle('all')}>全部</Button>
                    {
                        showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <Button type={styleStatus('unfinish')} onClick={() => statusToggle('unfinish')}>未完成</Button> : null
                    }
                    {
                        showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <Button type={styleStatus('finish')} onClick={() => statusToggle('finish')}>完成</Button> : null
                    }
                    {
                        showStatus === 'finish&&unfinish' || showStatus === 'clearFinish' ?
                        <Button type='text' onClick={() => statusToggle('clearFinish')}>清除已完成</Button>
                        :
                        null
                    }
                </Space>
            </Col>
        </Row>
    )
}

export default TodoList