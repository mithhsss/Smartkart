'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function SignupPage() {
  const { signup, isLoggedIn } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isLoggedIn) { router.push('/'); return null; }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) { setError('Please fill all fields'); return; }
    signup(name, email, phone, password);
    router.push('/');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🎉</span>
          <h1>Create Account</h1>
          <p>Join SmartKart for instant grocery delivery</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.field}><label>Full Name</label><input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className={styles.field}><label>Email</label><input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className={styles.field}><label>Phone</label><input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className={styles.field}><label>Password</label><input type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button type="submit" className={styles.submitBtn}>Create Account</button>
          <p className={styles.switch}>Already have an account? <Link href="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}
