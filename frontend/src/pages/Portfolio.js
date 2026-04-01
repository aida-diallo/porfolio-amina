import React, { useState, useEffect } from 'react';
import { getPortfolio } from '../services/api';
import Navbar from '../components/public/Navbar';
import Hero from '../components/public/Hero';
import About from '../components/public/About';
import Services from '../components/public/Services';
import Skills from '../components/public/Skills';
import Experience from '../components/public/Experience';
import Education from '../components/public/Education';
import Contact from '../components/public/Contact';
import Footer from '../components/public/Footer';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPortfolio();
        setData(response.data);
      } catch (error) {
        console.error('Erreur chargement portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(74, 144, 217, 0.2)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'rotate 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <Navbar />
      <Hero data={data.hero} cv={data.cv} />
      <About data={data.about} />
      <Services data={data.services} />
      <Skills data={data.skills} />
      <Experience data={data.experiences} />
      <Education data={data.education} />
      <Contact data={data.contact} />
      <Footer />
    </>
  );
};

export default Portfolio;
