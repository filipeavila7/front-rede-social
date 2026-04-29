import '../styles/NewPost.css'


function CriarPost() {
    return (
        <>
            <div className="criar-layout">
                <div className="criar-left">
                    <div className="criar-upload">
                        <div className="passo">
                            <p className='passo-p'>1. Sua arte</p>
                        </div>
                        <div className="upload-box">

                            <input
                                type="file"
                                id="fileUpload"
                                className="file-input"
                                accept="image/*"
                            />
                            <label htmlFor="fileUpload" className="upload-label">
                                <img className='upload-icon' src="/upload.png" alt="" />
                                <h3>Arraste sua imagem aqui</h3>
                                <p>ou clique para selecionar</p>
                                <small>PNG, JPG, WEBP até 10MB</small>
                            </label>

                        </div>
                    </div>
                    <div className="descricao-box">
                        <div className="passo">
                            <p className='passo-p'>2. Descrição</p>
                        </div>
                        <form className='descricao-form' action="">
                            <textarea className='descricao-input' name="" id="">

                            </textarea>
                            <div className='btn-criar-box'>
                                <button className='new-cancelar'>Cancelar</button>
                                <button className='btn-publicar'>
                                    <img src="new-icon" alt="" />
                                    Publicar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CriarPost