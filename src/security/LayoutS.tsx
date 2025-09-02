import Header from "../header/Header";
import MenuS from "./MenuS";
import styles from "./LayoutS.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.main}>
        <MenuS />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
