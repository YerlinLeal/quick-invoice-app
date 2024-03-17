import "./ProductsTable.css"
import DataTable from "react-data-table-component"
import { FaEdit , FaTrash} from "react-icons/fa"; 

const ProductsTable = (props) => {

    const { data } = props

    const columns = [
        {
            name: "Código",
            selector: row => row.code,
            sortable:true
        }, 
        {
            name: "Nombre",
            selector: row => row.description,
            sortable:true

        }, 
        {
            name: "Precio",
            selector: row => row.price,
            sortable:true
        }, 
        {
            name: "Editar",
            cell: row => 
                <button onClick={() => handleEdit(row)}>
                    <FaEdit />
                </button>,
        },
        {
            name: "Eliminar",
            cell: row => 
                <button onClick={() => handleDelete(row)}>
                    <FaTrash />
                </button>,
        }
    ]

    const handleEdit = (row) => {
        // Lógica para manejar la edición del producto
        console.log("Editar", row);
    };

    const handleDelete = (row) => {
        // Lógica para manejar el borrado del producto
        console.log("Borrar", row);
        let dataToSend = { code: row.code };
    };

    return <div>
        <DataTable className="my-table"
            columns={columns}
            data={data?.map((product) => ({
                code: product.code,
                description: product.description,
                price: product.price
            }))}
            pagination={true}
        />
    </div>

}

export default ProductsTable