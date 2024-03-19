import '../assets/css/pages/Invoice.css'
import React, { Component } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { API_BASE_URL } from '../utils/constants';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            invoice: {},
            invoiceId: '',
            modal: false
        };
    }

    // API requests
    getRequest = () => {
        axios.get(API_BASE_URL + "Sale" , {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then( response => {
            if(response.data.length === 0) this.props.mostrarToast("No existen facturas registradas");
            this.setState({ data: response.data });
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

    getProductById = () => {
        axios.get(API_BASE_URL + 'Sale/' + this.state.invoiceId, {
            headers: {
                'Authorization': 'Bearer ' + this.props.user.accessToken
            }
        }).then(response => {
            this.setState({ invoice: response.data }, () => {
                this.showModal();
            });
            
        }).catch(error => {
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
        });
    }
    
    // Functions
    showModal = () => {
        this.setState( { modal: !this.state.modal } );
    }
    
    getInvoiceId = (id) => {
        this.setState({ invoiceId: id }, () => {
            this.getProductById();
        });
    }

    getTotal = () => {
        return this.getSubtotal() + this.calculateTotalIVA();
    }

    calculateTotalIVA = () => {
        const currentInvoice = this.state.invoice;
        let totalIVA = 0;
        if (currentInvoice && currentInvoice.products) {
            totalIVA = currentInvoice.products.reduce((accumulator, product) => {
                if (product.applyIva) {
                    return accumulator + (product.price * product.quantity * 0.13);
                } else {
                    return accumulator;
                }
            }, 0);
        }
        return totalIVA;
    }

    getSubtotal = () => {
        const currentInvoice = this.state.invoice;
        let subtotal = 0;
        if (currentInvoice && currentInvoice.products) {
            subtotal = currentInvoice.products.reduce((accumulator, product) => {
                return accumulator + (product.price * product.quantity);
            }, 0);
        }
        return subtotal;
    }
    
    componentDidMount() {
        this.getRequest();
    }

    render() {
        const currentInvoice = this.state.invoice;
        return (
            <div className="container">
                <br />
                <table className="table overflow" id='table-invoice'>
                    <thead>
                        <tr>
                            <th>Encargado</th>
                            <th>Fecha de facturación</th>
                            <th>Monto total facturado</th>
                            <th>Detalle</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( invoice => {
                            const invoiceDate = new Date(invoice.date);
                            const formattedDate = invoiceDate.toISOString().split('T')[0];
                            return(
                                <tr key={invoice.id}>
                                    <td>{invoice.userName}</td>
                                    <td>{formattedDate}</td>
                                    <td>{"₡ " + invoice.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => this.getInvoiceId(invoice.id)}>
                                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* INVOICE DETAIL */}
                <Modal isOpen={this.state.modal}>
                    <ModalHeader style={{ display: 'block' }}>
                        # Factura: {currentInvoice ? currentInvoice.id : ''}
                        <span style={{ float: 'right' }} onClick={() => this.showModal()}>x</span>
                    </ModalHeader>
                    <ModalBody>
                        <h2 className="center">Quick Invoice</h2>
                        <hr/>
                        <table className="full-width">
                            <tbody>
                                <tr>
                                    <td className="left">Cliente:</td>
                                    <td className="right">CLIENTE GENERICO</td>
                                </tr>
                                <tr>
                                    <td className="left">Método:</td>
                                    <td className="right">Contado</td>
                                </tr>
                                <tr>
                                    <td className="left">Moneda:</td>
                                    <td className="right">CRC</td>
                                </tr>
                                <tr>
                                    <td className="left">Atiende:</td>
                                    <td className="right">{currentInvoice ? currentInvoice.userName : ''}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr/>
                        
                        <table className="full-width">
                            <thead>
                                <tr>
                                    <th className="left">Descripción</th>
                                    <th className="right">Cantidad</th>
                                    <th className="right">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInvoice.products ? (
                                    currentInvoice.products.map((product, index) => (
                                        <tr key={index}>
                                            <td className="left">{product.description}</td>
                                            <td className="right">{product.quantity}</td>
                                            <td className="right">{"₡ " + product.price.toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">No hay productos en esta factura</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <hr/>
                        <table className="full-width">
                            <tbody>
                                <tr>
                                    <td className="left">Subtotal:</td>
                                    <td className="right">{currentInvoice ? "₡ " + this.getSubtotal().toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2}) : ''}</td>
                                </tr>
                                <tr>
                                    <td className="left">IVA:</td>
                                    <td className="right">{"₡ " + this.calculateTotalIVA().toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                </tr>
                                <tr>
                                    <td className="left bold">TOTAL:</td>
                                    <td className="right bold">{"₡ " + this.getTotal().toLocaleString(undefined, {minimumFractionDigits: 2,maximumFractionDigits: 2})}</td>
                                </tr>
                            </tbody>
                        </table>
                        <hr/>
                        <h6>No se aplica la garantía sin su factura.</h6>
                        <br/>
                        <h4 className="center">¡Gracias por su compra!</h4>
                        <br/>
                        <span className="small">generado por: QuickInvoice</span>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Invoice;
