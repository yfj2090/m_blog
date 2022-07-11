import React, { useState, useRef, useEffect } from 'react'
import style from './index.module.scss'

const TodoList = () => {
    // TodoList 内容
    const [content, setContent] = useState([])
    // TodoList finish内容
    const [finishContent, setFinishContent] = useState([])
    // TodoList unFinish内容
    const [unFinishContent, setUnFinishContent] = useState([])
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
        }
    }, [content])

    useEffect(() => {
        // 判断 Footer Status 显隐状态
        if (finishContent.length && finishContent.length !== content.length) {
            setShowStatus('finish&&unfinish')
        } else if (finishContent.length && finishContent.length === content.length) {
            setShowStatus('clearFinish')
        } else {
            setShowStatus('all')
        }
    }, [finishContent])

    useEffect(() => {
        switch(status) {
            case 'all' || 'unfinish' || 'finish':
                {
                    let arr1 = []
                    let arr2 = []
                    content.forEach(item => {
                        if (!item.isfinish) {
                            arr1.push(item)
                        } else {
                            arr2.push(item)
                        }
                    })
                    setUnFinishContent(arr1)
                    setFinishContent(arr2)
                }
            break
            case 'clearFinish':
                {
                    let arr = []
                    content.forEach(item => {
                        if (!item.isfinish) {
                            arr.push(item)
                        }
                    })
                    setContent(arr)
                    setShowStatus('all')
                    setStatus('all')
                    setFinishContent([])
                    // setUnFinishContent([])
                }
            break
            default: break;
        }
    }, [status, content])

    // status 逻辑
    const statusLogic = (type) => {
       
    }

    // Item operate
    const operateItem = (type, id, isfinish) => {
        const contentCopy = [...content]
        const newFinishContent = []
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
        setContent(contentCopy)
        setFinishContent(newFinishContent)
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
        const item = item => <TodoItem key={item.id} item={item} operateItem={operateItem}/>
        switch(status) {
            case 'all' || 'clearFinish':
                return content.map(item)
            case 'unfinish':
                return unFinishContent.map(item)
            case 'finish':
                return finishContent.map(item)
            default: break;
        }
        
        
    }

    // onClick Footer Status
    const statusToggle = (type) => {
        setStatus(type)
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
    
    return (
        <div className={style.todoListStatus}>
                <span className={status === 'all' ? style.active : null} onClick={() => statusToggle('all')}>全部</span>
            {
                showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <span className={status === 'unfinish' ? style.active : null} onClick={() => statusToggle('unfinish')}>未完成</span> : null
            }
            {
                showStatus === 'finish&&unfinish' && showStatus !== 'clearFinish' ? <span className={status === 'finish' ? style.active : null} onClick={() => statusToggle('finish')}>完成</span> : null
            }
            
        </div>
    )
}

export default TodoList