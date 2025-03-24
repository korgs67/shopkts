import './App.css';
import Header from "./components/Header";
import NoutbukList from "./components/NoutbukList";
import Footer from "./components/Footer";
import axios from "axios";
import React, {useState} from "react";
import Modal from "./modal/Modal";

const API_URL = 'http://127.0.0.1:8000/noutbuks/'


function App() {
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
