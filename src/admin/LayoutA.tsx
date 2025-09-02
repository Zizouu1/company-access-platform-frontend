import Header from "../header/Header";
import MenuH from "./MenuA";
import styles from "./LayoutA.module.css";

export default function LayoutA({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.main}>
        <MenuH />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
