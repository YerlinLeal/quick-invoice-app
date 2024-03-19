import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './routes/Login';
import Home from './routes/Home';
import Product from './routes/Product';
import Sale from './routes/Sale';
import Invoice from './routes/Invoice';
import Page404 from './routes/Page404';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { userStorage } from './utils/userStorage';
import 'react-toastify/dist/ReactToastify.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          currentUser: null
      };
  }

  componentDidMount() {
    userStorage.currentUser.subscribe(x => this.setState({
        currentUser: x
    }));
  }

  mostrarToast = (mensaje) => {
    toast(mensaje);
  };

  render() {
    const currentUserValue = userStorage.currentUserValue;
    return (
      <>
        <Router>
          <Header user={currentUserValue}/>
          <ToastContainer />
          <Routes>
            <Route path='/login' element={!currentUserValue ? <Login mostrarToast = {this.mostrarToast} />
                                            : <Navigate to="/" />  
                                          } />
            <Route path='/product' element={currentUserValue ? <Product mostrarToast = {this.mostrarToast} user={currentUserValue} />
                                            : <Navigate to="/login" />
                                          } />
            <Route path='/sale' element={currentUserValue ? <Sale mostrarToast = {this.mostrarToast} user={currentUserValue} />
                                            : <Navigate to="/login" />
                                          } />
            <Route path='/invoice' element={currentUserValue ? <Invoice mostrarToast = {this.mostrarToast} user={currentUserValue} />
                                            : <Navigate to="/login" />
                                          } />
            <Route path='/' element={currentUserValue ? <Home />
                                            : <Navigate to="/login" />  
                                          } />
            <Route path='*' element={<Page404 />} />
          </Routes>
          <Footer user={currentUserValue}/>
        </Router>
      </>
    );
  }
}

export default App;
