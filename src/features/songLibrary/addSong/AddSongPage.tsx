import AddSongForm from "./components/AddSongForm";
import styles from "./AddSongPage.module.css";

export default function AddSongPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Add New Song</h2>
      <AddSongForm />
    </div>
  );
}
