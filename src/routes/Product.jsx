import '../assets/css/pages/Product.css'
import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { API_BASE_URL } from '../utils/constants';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            insertModal: false,
            confirmationModal: false,
            form : { code: '', description: '', price: '', applyIva: false, modalType: ''}
        };
    }

    // API requests
    getRequest = () => {
        axios.get(API_BASE_URL + 'Product', {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( respose => {
            if(respose.data.length === 0) this.props.mostrarToast("No existen productos registrados");
            this.setState({ data: respose.data });
        }).catch( error => {
            if (error && error.response) {
                switch (error.response.status) {
                    case 401:
                        this.props.mostrarToast("Ha ocurrido un error de autorización");
                        break;
                    default:
                        this.props.mostrarToast("Ha ocurrido un error");
                        break;
                }
            } else {
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    postRequest = async () => {
        await axios.post(API_BASE_URL + "Product", this.state.form, {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( response => {
            if(response.status === 201){
                this.showInsertModal();
                this.getRequest();
                this.props.mostrarToast("El producto ha sido creado");
            }
        }).catch( error => {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        this.props.mostrarToast("Los datos se han enviado de forma incorrecta, inténtelo nuevamente");
                        break;
                    case 401:
                        this.props.mostrarToast("Ha ocurrido un error de autorización");
                        break;
                    default:
                        this.props.mostrarToast("Ha ocurrido un error");
                        break;
                }
            } else if(error && error.message === "Request failed with status code 500"){
                this.props.mostrarToast("Producto no creado, código existente");
                this.showInsertModal();
            } else {
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    putRequest = () => {
        axios.put(API_BASE_URL + "Product/" + this.state.form.code, this.state.form,{
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( response => {
            if(response.status === 204) {
                this.showInsertModal();
                this.getRequest();
                this.props.mostrarToast("El producto ha sido actualizado exitosamente");
            }
        }).catch( error => {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        this.props.mostrarToast("Los datos se han enviado de forma incorrecta, inténtelo nuevamente");
                        break;
                    case 401:
                        this.props.mostrarToast("Ha ocurrido un error de autorización");
                        break;
                    case 404:
                        this.props.mostrarToast("El código del producto no existe");
                        break;
                    default:
                        this.props.mostrarToast("Ha ocurrido un error");
                        break;
                }
            }else{
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    deleteRequest = () => {
        axios.delete(API_BASE_URL + "Product/" + this.state.form.code, {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then(response=>{
            if(response.status === 204) {
                this.setState({confirmationModal: false});
                this.getRequest();
                this.props.mostrarToast("Producto eliminado");
            }
        }).catch( error => {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        this.props.mostrarToast("Los datos se han enviado de forma incorrecta, inténtelo nuevamente");
                        break;
                    case 401:
                        this.props.mostrarToast("Ha ocurrido un error de autorización");
                        break;
                    case 404:
                        this.props.mostrarToast("El código del producto no existe");
                        break;
                    default:
                        this.props.mostrarToast("Ha ocurrido un error");
                        break;
                }
            }else{
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    // Functions
    selectProduct = (product) => {
        this.setState({
            modalType: 'update',
            form: {
                code: product.code,
                description: product.description,
                price: product.price,
                applyIva: product.applyIva
            }
        })
    }
    
    showInsertModal = () => {
        this.setState( { insertModal: !this.state.insertModal } );
    }

    handleChange = async evt => {
        evt.persist();
        const { name, value, type, checked } = evt.target;
        
        await this.setState(prevState => ({
            form: {
                ...prevState.form,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.modalType === 'insert') {
            this.postRequest();
        } else {
            this.putRequest();
        }
    
        this.setState({
            form: {
                code: '',
                description: '',
                price: '',
                applyIva: false
            }
        });
    };
    

    componentDidMount() {
        this.getRequest();
    }

    render() {
        const {form}=this.state;
        return (
            <div className="container">
                <br />
                <button className="btn btn-success" onClick={ () => {this.setState({form: null, modalType: 'insert'}); this.showInsertModal()} } >Agregar Producto</button>
                <br /><br />
                
                <div className='overflow'>
                    <table className="table" id='table-products'>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Precio</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map( product => {
                                return(
                                    <tr key={product.code}>
                                        <td>{product.code}</td>
                                        <td>{product.description}</td>
                                        <td>{"₡ " + product.price.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                        <td>
                                        <button className="btn btn-primary" onClick={()=>{this.selectProduct(product); this.showInsertModal()}} ><FontAwesomeIcon icon={faEdit}/></button>
                                        </td>
                                        <td>
                                        <button className="btn btn-danger" onClick={()=>{this.selectProduct(product); this.setState({confirmationModal: true})}} ><FontAwesomeIcon icon={faTrashAlt}/></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <Modal isOpen={this.state.insertModal}>
                    <ModalHeader style={{ display: 'block' }}>
                        {this.state.modalType === 'insert' ? "Nuevo Producto" : "Editar Producto"}
                        <span style={{ float: 'right' }} onClick={() => this.showInsertModal()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <form className="form-group" onSubmit={this.handleSubmit}>
                            {/* CODIGO */}
                            <label htmlFor="code">Código</label>
                            {this.state.modalType === 'insert' ?
                                <input className="form-control" type="text" name="code" id="code" required value={form ? form.code : ''} onChange={this.handleChange}></input>
                                :
                                <div>
                                    <input className="form-control" type="text" name="code" id="code" required disabled value={form ? form.code : ''} onChange={this.handleChange}></input>
                                </div>
                            }
                            <br />
                            {/* NOMBRE */}
                            <label htmlFor="description">Nombre</label>
                            <input className="form-control" type="text" name="description" id="description" required value={form ? form.description : ''} onChange={this.handleChange}></input>
                            <br />
                            {/* PRECIO */}
                            <label htmlFor="price">Precio</label>
                            <input className="form-control" type="number" name="price" id="price" required value={form ? form.price : ''} onChange={this.handleChange} 
                                onInput={(e) => {
                                    if (parseFloat(e.target.value) <= 0) {
                                        e.target.setCustomValidity('Precio inválido, debe ser mayor a 0');
                                    } else {
                                        e.target.setCustomValidity('');
                                    }
                                }}>
                            </input>
                            <br />
                            {/* APLICA IVA */}
                            <label htmlFor="applyIva">Aplica IVA (13%)</label>
                            <input type="checkbox" name="applyIva" id="applyIva" checked={form && form.applyIva} value={form ? form.applyIva : false} onChange={this.handleChange} />
                            <br />
                            <br />
                            {' '}
                            {this.state.modalType === 'insert' ?
                                <button className="btn btn-success" type="submit" style={{ float: 'right' }}>Insertar</button>
                                :
                                <button className="btn btn-success" type="submit" style={{ float: 'right' }}>Actualizar</button>
                            }
                        </form>
                    </ModalBody>
                </Modal>


                <Modal isOpen={this.state.confirmationModal}>
                    <ModalBody>
                        ¿Está seguro que desea eliminar el producto {form && form.description}?
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={()=>this.deleteRequest()}>Sí</button>
                        <button className="btn btn-secundary" onClick={()=>this.setState({confirmationModal: false})}>No</button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}

export default Product;
