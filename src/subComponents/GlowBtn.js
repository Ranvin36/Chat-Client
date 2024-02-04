function GlowBtn({text,onChange}){
    return(
        <div className="reset-input-container">
                <input type="text" placeholder={text} onChange={(e)=>onChange(e.target.value)} />
        </div>
    )
}

export default GlowBtn