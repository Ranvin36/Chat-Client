function InputContainer({onChange,label,type}){
    return(
        <div className="input-layer">
            <label>{label}</label>
            <div className="input-container">
                <input type={type} onChange={(e)=>onChange(e.target.value)} />
            </div>
        </div>
    )
}

export default InputContainer