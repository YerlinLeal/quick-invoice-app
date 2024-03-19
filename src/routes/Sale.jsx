import '../assets/css/pages/Sale.css'
import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../utils/constants';

class Sale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            insertModal: false,
            productData: { code: '', description: '', quantity: '', price: '', applyIva: '' },
            form : { userId: this.props.user.id, totalAmount: '', products: [] }
        };
    }

    // API requests
    getProductById = (event) => {
        event.preventDefault();
        axios.get(API_BASE_URL + "Product/" + this.state.productData.code, {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( response => {
            this.setState({ 
                productData:{
                    ...response.data,
                    quantity: this.state.productData.quantity
                }
            });
            
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
            } else {
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    postRequest = async () => {
        await this.setState({
            form:{
                userId: this.props.user.id,
                totalAmount: this.calculateTotalInvoice(this.state.data),
                products: this.state.data
            }
        })

        await axios.post(API_BASE_URL+"Sale",this.state.form, {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( response => {
            if(response.status === 201){
                this.props.mostrarToast("Factura creada exitosamente, revisar el historial de facturas");
                this.clearData();
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
            }else{
                this.props.mostrarToast("El servicio no está disponible");
            }
        })
    }

    // Functions
    calculateTotal(price, quantity, applyIva) {
        if(applyIva)
            return price * quantity + (price * quantity) * 0.13;
        else
            return price * quantity;
    }

    calculateTotalInvoice(products){
        let total = 0;
        for (var key in products) {
            total += this.calculateTotal(products[key].price, products[key].quantity, products[key].applyIva);
        }
        return total;
    }

    addProduct = (event) => {
        event.preventDefault();
        let dataTemp = [...this.state.data];
        const productIndex = dataTemp.findIndex(p => p.code === this.state.productData.code);
        if(productIndex !== -1) {
            const quantityToAdd = parseFloat(this.state.productData.quantity) || 0;
            const currentQuantity = parseFloat(dataTemp[productIndex].quantity) || 0;
            dataTemp[productIndex].quantity = currentQuantity + quantityToAdd;
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
            this.props.mostrarToast("Cantidad actualizada correctamente");
        } else {
            if(this.state.productData.code === '' || this.state.productData.code === null
            || this.state.productData.description === '' || this.state.productData.description === null){
                this.props.mostrarToast("Debes buscar el producto antes de agregarlo");
            } else {
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
                this.props.mostrarToast("Producto agregado correctamente");
            }
        }
    }
    

    removeProduct(product) {
        let dataTemp = this.state.data;
        let posicionAEliminar = dataTemp.indexOf(product);
        if (posicionAEliminar !== -1) {
            dataTemp.splice(posicionAEliminar, 1);
            this.setState({data: dataTemp});
        }
    }

    clearData = () => {
        this.setState({ 
            data: [],
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
                <br />
                <div className='form-product'>
                    <form className='form-product' id="search-form" onSubmit={this.getProductById}>
                        <label htmlFor="code">Código:</label>
                        <input className="form-control" type="text" name="code" id="code" required value={productData ? productData.code : ''} onChange={this.handleCodeChange}></input>
                        <button className="btn btn-secondary"><FontAwesomeIcon icon={faSearch}/></button>
                    </form>

                    <form className="form form-group form-product" onSubmit={this.addProduct}>
                        <label htmlFor="description">Nombre:</label>
                        <input className="form-control search-form-input" type="text" name="description" id="description" disabled required value={productData ? productData.description : ''} onChange={this.handleDescriptionChange}/>
                        <label htmlFor="quantity">Cantidad:</label>
                        <input className="form-control search-form-input" type="number" name="quantity" id="quantity" required value={productData ? productData.quantity : ''} onChange={this.handleQuantityChange} 
                            onInput={(e) => {
                                if (parseFloat(e.target.value) <= 0) {
                                    e.target.setCustomValidity('Cantidad inválida, debe ser mayor a 0');
                                } else {
                                    e.target.setCustomValidity('');
                                }
                            }}
                        />
                        <div className='center'>
                            <input id="form-button-submit" className="btn btn-secondary" type="submit" value="Agregar" />
                        </div>
                    </form>
                </div>

                <br /><br />

                <div className='overflow'>
                    <table className="table" id='table-sale'>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>IVA</th>
                                <th>Cantidad</th>
                                <th>Total</th>
                                <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Quitar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map( (product, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{product.code}</td>
                                        <td>{product.description}</td>
                                        <td>{"₡ " + product.price.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                        <td>{product.applyIva ? "₡ " + ((product.price * product.quantity) * 0.13).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2}) : "₡ " + (0).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                        <td >{product.quantity}</td>
                                        <td>{"₡ " + this.calculateTotal(product.price,product.quantity,product.applyIva).toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }} ><button className="btn btn-primary" onClick={() => this.removeProduct(product)} ><FontAwesomeIcon icon={faTrashAlt}/></button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <br /><br />

                <div className='right'>
                    <button className="btn btn-primary" onClick={() => this.postRequest()}>Crear factura</button>
                </div>

            </div>
        );
    }
}

export default Sale;