import '../assets/css/pages/Login.css'

import axios from 'axios';
import React from 'react';
import image from '../assets/img/image.png';
import { userStorage } from '../utils/userStorage';
import { API_BASE_URL } from '../utils/constants';
import {MDBContainer, MDBCol, MDBRow } from 'mdb-react-ui-kit';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          data: {username: '', password: ''}
        };   
    }

    handleUsernameChange = async evt => {
      evt.persist();
      await this.setState({
          data:{
              ...this.state.data,
              username: evt.target.value
          }
      });
    } 

    handlePasswordChange = async evt => {
      evt.persist();
      await this.setState({
          data:{
              ...this.state.data,
              password: evt.target.value
          }
      });
    } 

    authenticate = async evt => {
      evt.preventDefault();
      axios.post(API_BASE_URL + 'Login',this.state.data).then( response => {
        userStorage.login(response.data)
      }).catch( error => {
        this.props.mostrarToast("Usuario o contraseña incorrecta");
      });
      
    }

    render() {
      const {data}=this.state;
      return (
        <div className="container">
          <MDBContainer fluid className="my-form">
            <MDBRow>
              <MDBCol col='10' md='6'>
                <img className="img-fluid image" src={image} alt="Quick Invoice"/>
              </MDBCol>
              <MDBCol col='4' md='6'>
                  <form className="" onSubmit={this.authenticate}>
                    <h2 className='title' >Iniciar Sesión</h2>
                    <label className='label' htmlFor="username">Usuario</label>
                    <input className="form-control input" type="text" name="username" id="username" required value={data ? data.username : ''} onChange={this.handleUsernameChange}/>
                    <label className='label' htmlFor="password">Contraseña</label>
                    <input className="form-control input" type="password" name="password" id="password" required autoComplete="on" value={data ? data.password : ''} onChange={this.handlePasswordChange} />
                    <input className="custom-button" type="submit" value="Iniciar sesión" />
                  </form>
              </MDBCol>
            </MDBRow>
          </MDBContainer>

        </div>
      )
    }
}

export default Login;