import './App.css';
// import React, { Component } from 'react';
// import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
// import axios from "axios";
// import Footer from './components/Footer/Footer';
// import ProductsForm from './components/ProductsForm/ProductsForm';
// import ProductsTable from './components/ProductsTable/ProductsTable';
import Header from './components/Header';
import Home from './routes/Home';
import Product from './routes/Product';
import Sale from './routes/Sale';
import Page404 from './routes/Page404';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/sale' element={<Sale />} />
          <Route path='*' element={<Page404 />} />
            {/* 
              <Route path='/posts/:id' element={<Post />} />
              <Route path="/categoria/:id/*" element={<Categoria />} />
             */}
      </Routes>
    </Router>
    </>
  );
}

export default App;
