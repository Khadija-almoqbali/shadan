import { Outlet } from 'react-router-dom';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container } from 'react-bootstrap';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./assets/styles/rtl.css";
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  const { i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.setAttribute("lang", i18n.language);
  }, [i18n.language]);

  return (
    <>
      <Header />

      <main className={`py-3 ${isRTL ? "rtl-content" : "ltr-content"}`}>
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;