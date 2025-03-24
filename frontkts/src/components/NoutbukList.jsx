import React from "react";
import Noutbuk from "./Noutbuk";

export class NoutbukList extends React.Component{
    orders = []
    // this.addToOrder = this.addToOrder.bind(this)
    render() {
        return(
            <main>
                {this.props.noutbuks.map(el =>(
                  <Noutbuk key={el.id} noutbuk={el} onAdd={this.props.onAdd} />

                ))}

            </main>
        );

}
    }





// const NoutbukList = ({noutbuks}) => {
//     return(
//         <div>
//             {noutbuks.map(el => <Noutbuk key={el.id} el={el} />)}
//
//         </div>
//     )
// }
export default NoutbukList;