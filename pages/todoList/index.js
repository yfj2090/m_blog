import React, { useState, useEffect, useRef, useCallback } from 'react'

const TodoList = () => {
    const [content, setContentArr] = useState([]);

    const inputRef = useRef();

    // Item checkbox toggle
    const selectItem = (id, isfinish) => {
        const contentCopy = [...content]
        contentCopy.forEach(v => {
            if (v.id === id) {
                v.isfinish = isfinish
            }
        })
        setContentArr(contentCopy)
    }

    // Item delete
    const deleteItem = (id) => {
        const contentCopy = [...content]
        contentCopy.forEach((v,i) => {
            if (v.id === id) {
                contentCopy.splice(i, 1)
            }
        })
        setContentArr(contentCopy)
    } 

    // Submit
    const Submit = () => {
        let item = {
            id: '',
            name: '',
            isfinish: false
        }
        item.id = new Date().getTime()
        item.name = inputRef.current.value
        
        setContentArr([...content, item])
    }

    console.log('content', content)
    return (
        <div className='todoList'>
            <div className='title'>todoList Demo</div>
            <div className='input'>
                <input type='text' ref={inputRef}/>
                <button onClick={Submit}>Submit</button>
            </div>
            <div className='content'>
                {
                    content.length ? 
                    content.map(item => <TodoItem key={item.id} item={item} selectItem={selectItem} deleteItem={deleteItem} />)
                    : null

                }
            </div>
        </div>
    )
} 

const TodoItem = (props) => {
    const { id, name, isfinish } = props.item
    const { selectItem, deleteItem } = props
    return (
        <div className='todoItem'>
            <p>
                <input type="checkbox" value={isfinish} onChange={(e) => { selectItem(id, e.target.checked) }}/>
                {
                    isfinish ? <del>{name}</del> : <span>{name}</span>
                }
                
                <button onClick={() => { deleteItem(id) }}>X</button>
            </p>
        </div>
    )
} 

export default TodoList