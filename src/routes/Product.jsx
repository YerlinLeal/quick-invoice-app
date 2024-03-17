import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader, Tooltip  } from 'reactstrap';

const API_BASE_URL = "https://localhost:7299/api/Product";

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
        axios.get(API_BASE_URL).then( respose => {
            this.setState({ data: respose.data });
        }).catch( error => {
            console.log(error.message);
        })
    }

    postRequest = async () => {
        await axios.post(API_BASE_URL,this.state.form).then( response => {
            this.showInsertModal();
            this.getRequest();
        }).catch( error => {
            console.log(error.message);
        })
    }

    putRequest = () => {
        axios.put(API_BASE_URL + "/" + this.state.form.code, this.state.form).then( response => {
            this.showInsertModal();
            this.getRequest();
        }).catch( error => {
            console.log(error.message);
        })
    }

    deleteRequest = () => {
        axios.delete(API_BASE_URL + "/" + this.state.form.code).then(response=>{
            this.setState({confirmationModal: false});
            this.getRequest();
        }).catch( error => {
            console.log(error.message);
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
        const { name, value, type, checked } = evt.target;
        evt.persist();
        await this.setState(prevState => ({
            form: {
                ...prevState.form,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    }

    componentDidMount() {
        //console.log('Componente montado');
        this.getRequest();
    }

    render() {
        //console.log('Renderizando componente');
        const {form}=this.state;
        return (
            <div className="container">
                <br /><br /><br />
                <button className="btn btn-success" onClick={ () => {this.setState({form: null, modalType: 'insert'}); this.showInsertModal()} } >Agregar Producto</button>
                <br /><br />
                <table className="table">
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
                                    <td>{product.price}</td>
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

                <Modal isOpen = {this.state.insertModal}>
                    <ModalHeader style={{display:'block'}}>
                        <span style={{float: 'right'}} onClick={()=>this.showInsertModal()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="code">Código</label>
                            
                            {this.state.modalType === 'insert' ?
                            <input className="form-control" type="text" name="code" id="code" value={ form ? form.code : ''} onChange={this.handleChange}></input>
                            :
                            <div>
                                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="code" toggle={this.toggleTooltip}>
                                    El código no puede ser actualizado
                                </Tooltip>
                                <input className="form-control" type="text" name="code" id="code" readOnly value={ form ? form.code : ''} onChange={this.handleChange}></input>
                            </div>
                            }
                            <br/>

                            <label htmlFor="description">Nombre</label>
                            <input className="form-control" type="text" name="description" id="description" value={ form ? form.description : '' } onChange={this.handleChange}></input>
                            <br/>

                            <label htmlFor="price">Precio</label>
                            <input className="form-control" type="number" name="price" id="price" value={ form ? form.price : '' } onChange={this.handleChange}></input>
                            <br/>

                            <label htmlFor="applyIva">Aplica IVA (13%)</label>
                            <input type="checkbox" name="applyIva" id="applyIva" checked={form && form.applyIva} value={form ? form.applyIva : false} onChange={this.handleChange}/>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        
                        {this.state.modalType === 'insert' ?
                            <button className="btn btn-success" onClick={() => this.postRequest()}>Insertar</button>
                            :
                            <button className="btn btn-success" onClick={() => this.putRequest()}>Actualizar</button>
                        }
                        
                        <button className="btn btn-danger" onClick={() => this.showInsertModal()}>Cancelar</button>
                    </ModalFooter>
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
