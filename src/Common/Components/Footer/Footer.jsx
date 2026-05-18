import React from 'react';
import styles from "./footer.module.scss";
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../../../public/logo.svg";
import { navLinks } from '@/static/static';
import { getPackageList } from '@/services/packageServices';

const Footer = async () => {
  // Fetch packages to build dynamic destination list
  const res = await getPackageList({ limit: 50 });
  const packages = res?.data || [];

  // Deduplicate destinations
  const seen = new Set();
  const destinations = packages
    .filter((p) => p.destination && p.destinationSlug)
    .reduce((acc, p) => {
      if (!seen.has(p.destinationSlug)) {
        seen.add(p.destinationSlug);
        acc.push({ name: p.destination, slug: p.destinationSlug });
      }
      return acc;
    }, [])
    .slice(0, 8);

  return (
    <footer className={styles.footerWrapper}>
      <div className='container'>
        <div className={styles.grid}>

          {/* Brand column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <Image src={logo} alt="World Tour Trip" height={44} />
            </Link>
            <p className={styles.description}>
              Discover curated travel packages and destinations crafted for Indian explorers. From weekend getaways to international adventures, we make every journey unforgettable.
            </p>
          </div>

          {/* Quick links column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.route}>{link.routeText}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages / Destinations column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Packages</h4>
            <ul className={styles.linkList}>
              {destinations.length > 0 ? (
                destinations.map((dest) => (
                  <li key={dest.slug}>
                    <Link href={`/package?destination=${dest.slug}`}>{dest.name}</Link>
                  </li>
                ))
              ) : (
                <li><Link href="/package">View All Packages</Link></li>
              )}
            </ul>
          </div>

          {/* Contact column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact Us</h4>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:info@worldtourtrip.com">info@worldtourtrip.com</a>
              </li>
              <li>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+918506805391">+91 8506805391</a>
              </li>
              <li>
                <span className={styles.contactLabel}>Address</span>
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal row */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} World Tour Trip. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
