import React from "react";
import { Link } from "react-router-dom";

class Noutbuk extends React.Component {
  render() {
    const { noutbuk, onAdd } = this.props;

    return (
      <div className="container">
        <div className="country">
          <Link to={`/noutbuk/${noutbuk.id}`}>
            <img src={noutbuk.img} alt={noutbuk.description} className="foto" />
          </Link>
          <h3 className="nalichiye">{noutbuk.nalichiye}</h3>
          <Link to={`/noutbuk/${noutbuk.id}`} className="description-link">
            <p className="description">{noutbuk.description}</p>
          </Link>
          <b className="price">{noutbuk.price} р.</b>
          <div className="add-to-carz" onClick={() => onAdd(noutbuk)}>
            +
          </div>
        </div>
      </div>
    );
  }
}

export default Noutbuk;