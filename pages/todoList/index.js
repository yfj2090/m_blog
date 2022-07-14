import React, { useState, useRef, useEffect } from 'react'
import style from './index.module.scss'

const TodoList = () => {
    // TodoList 内容
    const [content, setContent] = useState([])
    // TodoList Status Toggle => all, finish&&unfinish, clearFinish
    const [showStatus, setShowStatus] = useState('all')
    // 剩余任务数量
    const [contentleft, setContentLeft] = useState(0)
    // Footer 状态 => all, finish, unfinish, clearFinish
    const [status, setStatus] = useState('all')

    const inputRef = useRef()

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
    const submit = () => {
        if (!inputRef.current.value) return
        let item = {
            id: '',
            name: '',
            isfinish: false
        }
        item.id = new Date().getTime()
        item.name = inputRef.current.value
        
        setContent([...content, item])
        // 提交成功后，删除input的输入数据
        inputRef.current.value = ''
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
                <input type='text' ref={inputRef}/>
                <button onClick={submit}>Submit</button>
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
                    <span>{`剩余 ${ contentleft } 个项目`}</span>
                    <TodoFooterStatus status={status} statusToggle={statusToggle} contentleft={contentleft}  showStatus={showStatus}/>
                    {
                        showStatus === 'finish&&unfinish' || showStatus === 'clearFinish' ?
                        <div className={style.todoListStatus}>
                            <span onClick={() => statusToggle('clearFinish')}>清除已完成</span>
                        </div>
                        :
                        null
                    }
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
            <input type="checkbox" checked={isfinish} onChange={(e) => { operateItem('select', id, e.target.checked) }}/>
            {
                isfinish ? <span className={style.todoItemName}><del>{name}</del></span> : <span className={style.todoItemName}>{name}</span>
            }
            <button className={style.todoItemDelete} onClick={() => { operateItem('delete', id) }}>X</button>
        </div>
    )
}

const TodoFooterStatus = (props) => {
    const { status, statusToggle, showStatus } = props
    // 判断 status css active
    const styleStatus = (type) => status === type ? style.active : null
    return (
        <div className={style.todoListStatus}>
                <span className={status === 'all' ? style.active : null} onClick={() => statusToggle('all')}>全部</span>
            {
                showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <span className={styleStatus('unfinish')} onClick={() => statusToggle('unfinish')}>未完成</span> : null
            }
            {
                showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <span className={styleStatus('finish')} onClick={() => statusToggle('finish')}>完成</span> : null
            }
            
        </div>
    )
}

export default TodoList