import Header from "../header/Header";
import MenuH from "./MenuH";
import styles from "./LayoutH.module.css";

export default function LayoutH({ children }: { children: React.ReactNode }) {
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
