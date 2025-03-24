import React from "react";

class Noutbuk extends React.Component {
    render() {
        return(
        <div className='container'>
            <div className='country'>
                <img src={this.props.noutbuk.img} className='foto'/>
                <h3 className='nalichiye'>{this.props.noutbuk.nalichiye}</h3>
                <p className='description'>{this.props.noutbuk.description}</p>
                <b className='price'>{this.props.noutbuk.price} р.</b>
                <div className='add-to-carz' onClick={()=> this.props.onAdd(this.props.noutbuk)}>+</div>


            </div>
        </div>
    )
    }
}

export default Noutbuk