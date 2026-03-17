"use client";
import React, { useState } from "react";
import styles from "./mobileMenu.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/static/static";

const MobileMenu = ({ show, setShow, logo }) => {
  const route = usePathname();
  return (
    <>
      <div
        className={`${styles?.overlayMobile} ${
          show ? styles?.showOverlay : null
        }`}
        role="button"
        tabIndex="0"
        aria-label="Close mobile menu"
        onClick={() => {
          setShow(false);
        }}
      />
      <div
        className={`${styles?.mobileMenuWrapper} ${
          show ? styles?.showOverlay : null
        }`}
      >
        <div className={styles?.upContent}>
          <Link href={"/"} className={styles?.logoWrapper}  onClick={() => {
          setShow(false);
        }}>
            <Image src={logo} alt="main-logo" title="main-logo" priority />
          </Link>
          <button
            className={styles?.closeBtn}
            aria-label="Close Mobile Menu"
            onClick={() => {
              setShow(false);
            }}
          >
            <Icon icon="ic:round-close" width="24" height="24" />
          </button>
        </div>
        <nav className={styles?.navBarMobile}>
          <ul className={styles?.navBarList}>
            {navLinks?.map((val, i) => {
              return (
                <li className={styles?.navBarListItem} key={i}>
                  <Link
                    href={val?.route}
                    className={route == val?.route ? styles?.activeLink : null}
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    {val?.routeText}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
