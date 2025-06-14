import  { useEffect, useState } from "react";
import styles from "../styles/GetItemsList.module.scss";
import { Link } from "react-router-dom";

function GetItemsList() {
  const [items, setItems] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // State for filter

  useEffect(() => {
    setLoading(true);
    fetch("http://192.168.1.4:5000/get_items")
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch items");
        }
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setDataFilter(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error occurred");
        setLoading(false);
      });
  }, []);
  console.log(dataFilter, items);
  useEffect(() => {
    setDataFilter(
      items.filter((item) => {
        if (filter === "all") return items; // Show all items
        return item.state === filter; // Filter by state
      })
    );
    console.log(dataFilter);
  }, [filter]);

  if (loading) return <p className={styles.status}>Loading items...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <div>
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

      <ul className={styles.itemsList}>
        {dataFilter.map((item) => (
					<Link to={`/page/${item.uuid}`}>
          <li
            key={`${item.id}_${item.uuid}`}
            className={`${styles.item} ${
              item.state === "1" ? styles.green : styles.red
            }`}
          >
            <h3 className={styles.itemName}>{item.title}</h3>
            <p className={styles.itemValue}>{item.description}</p>
          </li>
					</Link>
        ))}
      </ul>
    </div>
  );
}

export default GetItemsList;
