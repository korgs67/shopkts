import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/noutbuks/";

export default function NoutbukDetail() {
  const { id } = useParams();
  const [noutbuk, setNoutbuk] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNoutbuk() {
      try {
        setLoading(true);
        const resp = await axios.get(`${API_URL}${id}/`);
        setNoutbuk(resp.data);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить данные ноутбука");
      } finally {
        setLoading(false);
      }
    }

    fetchNoutbuk();
  }, [id]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!noutbuk) {
    return <p>Ноутбук не найден</p>;
  }

  return (
    <div className="noutbuk-detail">
      <Link to="/">← Назад к списку</Link>
      <div className="noutbuk-detail-content">
        <img src={noutbuk.img} alt={noutbuk.description} className="foto" />
        <div className="noutbuk-detail-info">
          <h2>{noutbuk.description}</h2>
          <p className="nalichiye">{noutbuk.nalichiye}</p>
          <p className="price">{noutbuk.price} р.</p>
          {noutbuk.link && (
            <p>
              Оригинал на сайте:{" "}
              <a href={noutbuk.link} target="_blank" rel="noreferrer">
                открыть
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

