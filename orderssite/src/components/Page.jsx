import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Page.module.scss";
import { Link } from "react-router-dom";
import DragDropFileUpload from "./fileDrop";
import VideoEditorOnlineUpload from "./edit";
import axios from '../axiosConfig.js'; // Import the Axios configuration

function Page() {
  const { linkId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!linkId) return;

    setLoading(true);
    setError(null);
    setData(null);

    const fetchData = async () => {
      try {
        const response = await axios.post('/get_item', { param: linkId });
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [linkId]);

  if (loading) {
    return <>Loading...</>;
  }

  if (data != null && !loading) {
    const state = data[0];

    return (
      <>
        <div className={styles.component}>
          <div className={styles.item}>Telegram ID: {state.id}</div>
          <div className={styles.item}>Имя: {state.title}</div>
          <div className={styles.item}>Дата рождения: {state.date}</div>
          <div className={styles.item}>Комментарий: {state.description}</div>
          <div className={styles.item}>
            Состояние: {state.state === "1" ? "Готово" : "Не готово"}
          </div>
          <div className={styles.item}>
            Ссылка:{" "}
            <Link to={`http://192.168.1.4:3000/page/${state.uuid}`}>
              http://192.168.1.4:3000/page/{state.uuid}
            </Link>
          </div>
{state.state === "1" ? (<></>) : <VideoEditorOnlineUpload link={linkId} />}
          
        </div>
      </>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return null; // Return null if no data and no error
}

export default Page;
