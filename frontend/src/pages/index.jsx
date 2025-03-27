
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";


export default function Home() {

  const router = useRouter();
  return (
    <>
    <UserLayout>
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer_left}>

          <p>Connect with Friends</p>
          <p>A true social media platform!</p>

          <div onClick={()=>{
            router.push("/login")
          }} className={styles.buttonJoin}>
            <p>Join Now</p>
          </div>

        </div>

        <div className={styles.mainContainer_right}>
         <img src='photo.avif' alt="" srcset="" />
        </div>
      </div>
    </div>
    </UserLayout >
    </>
  );
}
