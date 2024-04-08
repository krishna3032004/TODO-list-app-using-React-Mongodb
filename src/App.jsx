import { useState,useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdNoFlash } from "react-icons/md";

function App() {
  const [count, setCount] = useState(0)
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(false)

  const gettodo =async ()=>{
    let req = await fetch("http://localhost:3000/")
    let items = await req.json()
    setTodos(items)
    console.log(todos)
  }

  useEffect(() => {
    gettodo()
  }, [])
  


  const handlechange = (e) => {
    setTodo(e.target.value)
  }

 
  const handlesave = async() => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])

    let res = await fetch("http://localhost:3000/", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({ id: uuidv4(), todo, isCompleted: false }), // body data type must match "Content-Type" header
    });
    console.log([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
  }


  const handledelete = async(e, id) => {
    let newtodos = todos.filter((e) => {
      return e.id !== id;
    })
    let a = confirm("Are you really want to delete this item?")
    if(a){
      setTodos(newtodos)
      console.log(id)
      let res = await fetch("http://localhost:3000/", {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({...todo,id}), // body data type must match "Content-Type" header
      });
    }
  }


  const handleedit = async(e, id) => {
    let t = todos.filter(item => item.id == id)
    setTodo(t[0].todo)
    let newtodos = todos.filter((e) => {
      return e.id !== id;
    })
    setTodos(newtodos)
    let res = await fetch("http://localhost:3000/", {
      method: "DELETE", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({id:id}), // body data type must match "Content-Type" header
    });
  }

  
  const handlecheckbox = async(e) => {
    let id = e.target.name;
    // console.log(id)
    let index = todos.findIndex(item => {
      return item.id == id;
    })
    let newtodo = [...todos];
    newtodo[index].isCompleted = !newtodo[index].isCompleted;
    setTodos(newtodo);

    // try {
      let res =await fetch(`http://localhost:3000/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id, isCompleted: newtodo[index].isCompleted} ),
      });
  }


  const toggleFinished = (e) => {
    setshowFinished(!showFinished)
  }


  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2 ">
        <div className="addtodo mb-5">
          <h2 className='text-lg font-bold'>Add a Todo</h2>
          <div className='flex'>
            <input type="text" onChange={handlechange} value={todo} className='w-full rounded-full px-5 py-1' />
            <button onClick={handlesave} disabled={todo.length <= 2} className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-6'>Save</button>
          </div>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished} /> show Finished
        <h2 className='text-lg font-bold'>Your Todos</h2>
        <div className="todos">
          {todos.length == 0 && <div className='m-5'>No todos to display</div>}
          {todos.map(item => {
            return (showFinished || !item.isCompleted) && <div key={item.todo} className="todo flex gap-4 justify-between items-center mb-1">
              <div className='flex gap-5 items-center w-full'>
                <input name={item.id} onChange={handlecheckbox} type="checkbox" checked={item.isCompleted} />
                <div className={item.isCompleted ? "line-through" : ""}>{item.todo}</div>
              </div>
              <div className="buttons flex">
                <button onClick={(e) => handleedit(e, item.id)} className='bg-violet-800 h-8 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                <button onClick={(e) => handledelete(e, item.id)} className='bg-violet-800 h-8 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><MdDelete /></button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default App
