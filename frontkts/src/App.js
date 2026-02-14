import './App.css';
import Header from "./components/Header";
import NoutbukList from "./components/NoutbukList";
import Footer from "./components/Footer";
import axios from "axios";
// import React, {useState} from "react";
import Modal from "./modal/Modal";
import { useState, useEffect } from 'react';


const API_URL = 'http://127.0.0.1:8000/noutbuks/'



function App() {

    const [ firstName, setFirstName] = useState('')
    const [ lastName, setLastName] = useState('')
    const [ username, setUsername] = useState('')
    const [ email, setEmail] = useState('')
    const [ dateJoined, setDateJoined] = useState('')
    const [ error, setError] = useState()

    useEffect(() => {
    fetch('http://127.0.0.1:8000/auth/login/?next=/noutbuks/')
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw Error(`Something went wrong: code ${response.status}`)
        }
      })
      .then(({data}) => {
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setUsername(data.username)
        setEmail(data.email)
        setDateJoined(data.date_joined)
      })
      .catch(error => {
        console.log(error)
        setError('Ошибка, подробности в консоли')
      })
      }, [])

    const [noutbuks, setNoutbuks] = useState([])
    async function getNoutbuks() {
        const response = await axios.get(API_URL)
        setNoutbuks(response.data)
    }
    const [modalActive, setModalActive] = useState(true)
    // const orders =[noutbuks]
    // this.addToOrder = this.addToOrder.bind(this)
    return (
       <div className="App">
             {error?
            <p>{error}</p>
          :
            <div className="Profile">
              <h1>{firstName} {lastName}</h1>
              <h2>{username}</h2>
              <p>email: {email}</p>
              <p>Профиль создан {dateJoined}</p>
            </div>
          }
           <Header/>
           <button onClick={getNoutbuks}>Обновить ноутбуки</button>
           <NoutbukList noutbuks = {noutbuks} onAdd={addToOrder}/>
           <Modal active={modalActive} setActive={setModalActive}/>
           <Footer/>

       </div>
    );
    function addToOrder(noutbuk) {
       this.setState({ orders: [...this.state.orders, noutbuk]}, () =>{
       console.log(this.state.opders)
        })

    }

    // function addToOrder(noutbuk) {
    //     this.setState({ orders: [...this.state.orders, noutbuk]}, () =>{
    //         console.log(this.state.opders)
    //     })
    //
    // }
}

export default App;
