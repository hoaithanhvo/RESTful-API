import { useEffect, useState } from "react";
import styles from "./App.module.scss"
import redact from "./assets/download.png"
import checkmark from "./assets/checkmark.png"
export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskIdDone, setTaskIdDone] = useState(null);
  const [numTasksDone, setNumTasksDone] = useState(0);
  console.log(tasks);
  const sortedTasks = tasks.sort((taskA, taskB) => {
    if (taskA.completed > taskB.completed)
      return 1;
    return -1;
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(json => setUsers(json))
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${selectedUser}/todos`)
      .then(response => response.json())
      .then(json => {
        setTasks(json);
        setNumTasksDone(json.filter(task => task.completed).length);
      })
      .catch(error => console.log(error))
  }, [selectedUser]);

  useEffect(() => {
    if (taskIdDone == null)
      return;

    fetch(`https://jsonplaceholder.typicode.com/todos/${taskIdDone}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "completed": true })
    })
      .then(response => response.json())
      .then(taskDone => {
        setTasks(tasks.map(task => {
          if (task.id == taskDone.id)
            return taskDone;
          return task;
        }));
        setNumTasksDone(numTasksDone + 1);
      })
      .catch(error => console.error(error))
  }, [taskIdDone]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Users</h2>
        <select className={styles.select} onChange={e => setSelectedUser(e.target.value)}>
          <option value={null}></option>
          {users.map(user =>
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          )}
        </select>
      </header>

      <main className={styles.task}>
        <h2 style={{ textAlign: "center" }}>Tasks</h2>
        <ul>
          {sortedTasks.map(task =>
            <li className={styles.item} key={task.id}>
              <div className={styles.title}> {task.completed && <img width={10} height={10} style={{ marginRight: "20px" }} src={checkmark}></img>}
                {!task.completed && <img width={10} height={10} style={{ marginRight: "20px" }} src={redact}></img>}
                {task.title}</div>

              {!task.completed && <button className={styles.button} onClick={() => setTaskIdDone(task.id)} >Mark Done</button>}
            </li>
          )}
        </ul>
        <p className={styles.bottom}>Done {numTasksDone}/{tasks.length} tasks</p>

      </main>
    </div>
  )
}
