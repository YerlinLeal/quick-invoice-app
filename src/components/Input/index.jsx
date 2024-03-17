import "./Input.css"

const Input = (props) => {
    const placeholderModified = `${props.placeholder}...`

    const { type = "text"} = props
    const handleChange = (e) => {
        if(type === "checkbox") {
            props.updateValue(e.target.checked);
        } else {
            props.updateValue(e.target.value);
        }
    }

    return <div className={`input input-${type}`}>
        <label>{props.title}</label>
        <input
            placeholder={placeholderModified}
            required={props.required}
            value={props.value}
            onChange={handleChange}
            type={type}
        />
    </div>
}

export default Input