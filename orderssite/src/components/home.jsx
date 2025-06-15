import { useEffect, useState } from "react";
import styles from "../styles/GetItemsList.module.scss";
import { Link } from "react-router-dom";
import axios from '../axiosConfig'; // Import the Axios configuration

function GetItemsList() {
  const [items, setItems] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // State for filter

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/get_items");
        setItems(response.data);
        setDataFilter(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    setDataFilter(
      items.filter((item) => {
        if (filter === "all") return true; // Show all items
        return item.state === filter; // Filter by state
      })
    );
  }, [filter, items]);

  if (loading) return <p className={styles.status}>Loading items...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
      <div className={styles.filterButtons}>
        <button
          onClick={() => setFilter("all")}
          className={styles.filterButton}
        >
          All
        </button>
        <button onClick={() => setFilter("1")} className={styles.filterButton}>
          Готовые
        </button>
        <button onClick={() => setFilter("0")} className={styles.filterButton}>
          Не готовые
        </button>
      </div>

      <div className={styles.itemsList}>
        {dataFilter.map((item) => (
          <Link to={`/page/${item.uuid}`} key={`${item.id}_${item.uuid}`}>
            <div className={styles.item}>
              <h3 className={`${styles.itemName} ${item.state === "1" ? styles.green : styles.red}`}>
                {item.title}
              </h3>
              <p className={styles.itemValue}>{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default GetItemsList;
