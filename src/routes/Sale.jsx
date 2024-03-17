import '../assets/css/Sale.css'
import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader  } from 'reactstrap';

const API_BASE_URL = "https://localhost:7299/api/";

class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            insertModal: false,
            productData: { code: '', description: '', quantity: '', price: '', applyIva: '' },
            // form : { id: '', userId: '', price: '', userName: '', date: '', totalAmount: '' , 
            //     products: {
            //         code: '', description: '', price: '', applyIva: '', quantity: ''
            //     }
            // }
        };
    }

    // API requests
    getProductById = (event) => {
        event.preventDefault();
        axios.get(API_BASE_URL + "Product/" + this.state.productData.code).then( response => {
            this.setState({ 
                productData:{
                    ...response.data,
                    quantity: this.state.productData.quantity
                }
            });
            
        }).catch( error => {
            console.log(error.message);
        })
    }

    getRequest = () => {
        axios.get(API_BASE_URL).then( respose => {
            //this.setState({ data: respose.data });
        }).catch( error => {
            console.log(error.message);
        })
    }

    postRequest = async () => {
        // await axios.post(API_BASE_URL,this.state.form).then( response => {
        //     this.showInsertModal();
        //     this.getRequest();
        // }).catch( error => {
        //     console.log(error.message);
        // })
    }

    // Functions
    calculateTotal(price, quantity, applyIva) {
        if(applyIva)
            return price * quantity + (price * quantity) * 0.13;
        else
            return price * quantity;
    }

    addProduct = (event) => {
        event.preventDefault();
        let dataTemp = this.state.data;
        dataTemp.push(this.state.productData);
        this.setState({ 
            data: dataTemp,
            productData:{
                code: '',
                quantity: '',
                description: '',
                price: '',
                applyIva: ''
            }
        });
    }
    
    showInsertModal = () => {
        this.setState( { insertModal: !this.state.insertModal } );
    }

    handleQuantityChange = async evt => {
        evt.persist();
        await this.setState({
            productData:{
                ...this.state.productData,
                quantity: evt.target.value
            }
        });
    }

    handleDescriptionChange = async evt => {
        evt.persist();
        await this.setState({
            productData:{
                ...this.state.productData,
                description: evt.target.value
            }
        });
    }

    handleCodeChange = async evt => {
        evt.persist();
        await this.setState({
            productData:{
                ...this.state.productData,
                code: evt.target.value,
                quantity: '',
                description: '',
                price: '',
                applyIva: ''
            }
        });
    }

    componentDidMount() {
        
    }

    render() {
        const {productData}=this.state;
        return (
            <div className="container">
                <br /><br />
                <div className='form-product'>
                    <form className='form-product' onSubmit={this.getProductById}>
                        <label htmlFor="code">Código</label>
                        <input className="form-control" type="text" name="code" id="code" required value={productData ? productData.code : ''} onChange={this.handleCodeChange}></input>
                        <button className="btn btn-secondary"><FontAwesomeIcon icon={faSearch}/></button>
                    </form>

                    <form className="form form-group form-product" onSubmit={this.addProduct}>
                        <label htmlFor="description">Nombre</label>
                        <input className="form-control" type="text" name="description" id="description" disabled required value={productData ? productData.description : ''} onChange={this.handleDescriptionChange}/>
                        <label htmlFor="quantity">Cantidad</label>
                        <input className="form-control" type="number" name="quantity" id="quantity" required value={productData ? productData.quantity : ''} onChange={this.handleQuantityChange} />
                        <input className="btn btn-secondary" type="submit" value="Agregar" />
                    </form>
                </div>

                <br /><br />

                <table className="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>IVA</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Quitar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( (product, index) => {
                            return(
                                <tr key={index}>
                                    <td>{product.code}</td>
                                    <td>{product.description}</td>
                                    <td>{product.price}</td>
                                    <td>{product.applyIva ? (product.price * product.quantity) * 0.13 : "0"}</td>
                                    <td>{product.quantity}</td>
                                    <td>{this.calculateTotal(product.price,product.quantity,product.applyIva)}</td>
                                    <td><button className="btn btn-primary" onClick={()=>{this.selectProduct(product); this.showInsertModal()}} ><FontAwesomeIcon icon={faEdit}/></button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <br /><br />

                <div>
                    <button className="btn btn-primary" onClick={() => this.postRequest()}>Crear factura</button>
                </div>

            </div>
        );
    }
}

export default Sale;