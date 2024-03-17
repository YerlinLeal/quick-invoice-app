import React, { useState } from "react";
import "./ProductsForm.css";
import Input from "../Input";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import axios from "axios";

const ProductsForm = (props) => {
    const { getRequest, modalType = "create" } = props

    const [code, updateCode] = useState("");
    const [description, updateDescription] = useState("");
    const [price, updatePrice] = useState("");
    const [applyIva, updateApplyIva] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let dataToSend = { code, description, price, applyIva };
        console.log(dataToSend);
        postRequest(dataToSend);
        getRequest();
        setShowModal(false);
    };

    const postRequest = async (body) => {
        await axios.post("https://localhost:7299/api/Product", body).then(response=>{
            this.getRequest();
        }).catch( error => {
            console.log( error.message );
        })
    }

    return (
        <div>
            <button className = "custom-button" onClick={() => setShowModal(true)}>Abrir Modal</button>
            <Modal className = "my-form" isOpen = { showModal }>
                <ModalHeader style={{display: 'block'}}>
                    <span className = "custom-button" style={{float: 'right'}} onClick={()=> setShowModal(false)}>x</span>
                </ModalHeader>
                <ModalBody>
                    <h2>Nuevo Producto</h2>
                    <Input
                        title="Código"
                        placeholder="Ingresar el código del producto"
                        required
                        value={code}
                        updateValue={updateCode}
                    />
                    <Input
                        title="Nombre"
                        placeholder="Ingresar el nombre del producto"
                        required
                        value={description}
                        updateValue={updateDescription}
                    />
                    <Input
                        title="Precio"
                        placeholder="Ingresar el precio del producto"
                        required
                        value={price}
                        updateValue={updatePrice}
                        type="number"
                    />
                    <Input
                        title="Aplica IVA (13%)"
                        value={applyIva}
                        updateValue={updateApplyIva}
                        type="checkbox"
                    />
                </ModalBody>
                <ModalFooter>
                {modalType === 'create'?
                    <button className = "custom-button" onClick={ (e) => handleSubmit(e) }>
                        Insertar
                    </button>: <button className="btn btn-primary">
                        Actualizar
                    </button>
                }
                    <button className = "custom-button" onClick={()=> setShowModal(false) }>Cancelar</button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default ProductsForm;