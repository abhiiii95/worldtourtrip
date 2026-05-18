import React from 'react';
import styles from "./packageBread.module.scss";
import Link from 'next/link';

const BreadPackage = ({path}) => {
  return (
    <section className={styles?.packageBread}>
      <div className='container'>
        <ul className={styles?.breadList}>
            <li><Link href="/">Home</Link></li>

            <li><Link href="/package">Package</Link></li>
            <li>
            {path?.package.split("-").join(" ")}
            </li>
        </ul>
      </div>
    </section>
  )
}

export default BreadPackage
