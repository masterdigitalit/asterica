import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Page.module.scss";
import { Link } from "react-router-dom";
import DragDropFileUpload from "./fileDrop";

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

    const serverUrl = "http://192.168.1.4:5000/get_item";

    fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ param: linkId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message =
            errorData.error || `Request failed with status ${res.status}`;
          throw new Error(message);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [linkId]);

  if (loading === true) {
    return <>loading</>;
  }
  if (data != null && loading === false) {
    const state = data[0];

    return (
      <>
        <div className={styles.component}>
          <div className={styles.item}>telegram id : {state.id}</div>
          <div className={styles.item}>Имя : {state.title}</div>
          <div className={styles.item}>Дата рождения : {state.date}</div>
          <div className={styles.item}>Комментарий : {state.description}</div>
          <div className={styles.item}>
            Состояние : {state.state === "1" ? "готово" : "не готово"}
          </div>
          <div className={styles.item}>
            Ссылка :{" "}
            <Link to={`http://192.168.1.4:3000/page/${state.uuid}`}>
              http://192.168.1.2:3000/page/{state.uuid}
            </Link>
          </div>
          <DragDropFileUpload name={linkId + ".mp4"} />
        </div>
      </>
    );
  }
  if (error) {
    return error;
  }
}

export default Page;
