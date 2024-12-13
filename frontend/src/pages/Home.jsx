import React from 'react'
import '../styles/home.css';
import Hero from "../components/home-components/Hero/Hero";
import Programs from "../components/home-components/Programs/Programs";
import Reasons from "../components/home-components/Reasons/Reasons";
import Plans from "../components/home-components/Plans/Plans";
import Testimonials from "../components/home-components/Testimonials/Testimonials";
import Join from "../components/home-components/Join/Join";
import Footer from "../components/home-components/Footer/Footer";
const Home = () => {
  return (
    <div>
      <Hero />
      <Programs />
      <Reasons />
      <Plans />
      <Testimonials />
      <Join />
      <Footer /> 
    </div>
  )
}

export default Home
