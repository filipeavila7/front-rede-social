import "../styles/NewPost.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import ConfirmModal from "./ConfirmModal";
import usePostDraftStore from "../store/postDraftStore";

function CriarPost() {
    const [tags, setTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [previewImage, setPreviewImage] = useState(null)
    const [imageUrl, setImageUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [showExitModal, setShowExitModal] = useState(false)

    const inputTitulo = useRef()
    const inputDescricao = useRef()
    const inputImagem = useRef()

    const navigate = useNavigate()
    const setHasUnsavedChanges = usePostDraftStore((state) => state.setHasUnsavedChanges)

    useEffect(() => {
        api.get("/tags")
            .then((res) => {
                setTags(res.data || [])
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        return () => {
            setHasUnsavedChanges(false)
        }
    }, [setHasUnsavedChanges])

    function hasDraftData() {
        const titulo = inputTitulo.current?.value?.trim() || ""
        const descricao = inputDescricao.current?.value?.trim() || ""

        return Boolean(titulo || descricao || previewImage || selectedTags.length > 0)
    }

    useEffect(() => {
        function handleBeforeUnload(e) {
            const titulo = inputTitulo.current?.value?.trim() || ""
            const descricao = inputDescricao.current?.value?.trim() || ""
            const hasDraft = Boolean(titulo || descricao || previewImage || selectedTags.length > 0)

            if (!hasDraft) return

            e.preventDefault()
            e.returnValue = ""
        }

        window.addEventListener("beforeunload", handleBeforeUnload)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
        }
    }, [previewImage, selectedTags])

    function updateDraftState(overrides = {}) {
        const titulo = overrides.title ?? inputTitulo.current?.value ?? ""
        const descricao = overrides.description ?? inputDescricao.current?.value ?? ""
        const nextSelectedTags = overrides.selectedTags ?? selectedTags
        const nextPreviewImage = overrides.previewImage ?? previewImage

        const hasDraft = Boolean(
            titulo.trim() ||
            descricao.trim() ||
            nextPreviewImage ||
            nextSelectedTags.length > 0
        )

        setHasUnsavedChanges(hasDraft)
    }

    function handleSelectTag(tag) {
        const tagAlreadySelected = selectedTags.some((selectedTag) => selectedTag.id === tag.id)

        if (tagAlreadySelected || selectedTags.length >= 3) {
            return
        }

        const nextSelectedTags = [...selectedTags, tag]
        setSelectedTags(nextSelectedTags)
        updateDraftState({ selectedTags: nextSelectedTags })
    }

    function handleRemoveTag(tagId) {
        const nextSelectedTags = selectedTags.filter((tag) => tag.id !== tagId)
        setSelectedTags(nextSelectedTags)
        updateDraftState({ selectedTags: nextSelectedTags })
    }

    async function handleImageChange(e) {
        const file = e.target.files?.[0]
        if (!file) return

        const previewUrl = URL.createObjectURL(file)
        setPreviewImage(previewUrl)
        updateDraftState({ previewImage: previewUrl })

        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await api.post("/files/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            setImageUrl(res.data.url)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleCreatePost(e) {
        e.preventDefault()

        if (!imageUrl) {
            console.log("A imagem ainda nao foi enviada.")
            return
        }

        try {
            setLoading(true)

            const postData = {
                content: inputTitulo.current?.value || "",
                description: inputDescricao.current?.value || "",
                imageUrl,
                tagIds: selectedTags.map((tag) => tag.id),
            }

            const res = await api.post("/posts", postData)
            console.log("Post criado com sucesso:", res.data)

            if (inputTitulo.current) inputTitulo.current.value = ""
            if (inputDescricao.current) inputDescricao.current.value = ""
            if (inputImagem.current) inputImagem.current.value = ""

            setSelectedTags([])
            setPreviewImage(null)
            setImageUrl("")
            setHasUnsavedChanges(false)
        } catch (error) {
            console.log("Erro ao criar post:", error)
        } finally {
            setLoading(false)
        }
    }

    function handleCancelClick() {
        if (!hasDraftData()) {
            navigate("/feed")
            return
        }

        setShowExitModal(true)
    }

    function confirmExit() {
        setHasUnsavedChanges(false)
        setShowExitModal(false)
        navigate("/feed")
    }

    return (
        <>
            <div className="criar-layout">
                <div className="criar-left">
                    <div className="criar-upload">
                        <div className="passo">
                            <p className="passo-p"><span>1.</span> Sua arte</p>
                        </div>
                        <div className="upload-box">
                            <input
                                type="file"
                                id="fileUpload"
                                className="file-input"
                                accept="image/*"
                                ref={inputImagem}
                                onChange={handleImageChange}
                            />
                            <label htmlFor="fileUpload" className={`upload-label ${previewImage ? "upload-label-preview" : ""}`}>
                                {previewImage ? (
                                    <img className="upload-preview" src={previewImage} alt="Preview da imagem" />
                                ) : (
                                    <>
                                        <img className="upload-icon" src="/upload.png" alt="" />
                                        <h3>Arraste sua imagem aqui</h3>
                                        <p>ou clique para selecionar</p>
                                        <small>PNG, JPG, WEBP ate 10MB</small>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <div className="descricao-box">
                        <div className="passo">
                            <p className="passo-p"><span>2.</span> Descricao</p>
                        </div>
                        <form className="descricao-form" action="">
                            <textarea
                                className="descricao-input"
                                ref={inputDescricao}
                                onInput={(e) => updateDraftState({ description: e.target.value })}
                            ></textarea>
                            
                        </form>
                    </div>
                </div>

                <div className="criar-right">
                    <div className="detalhes-box">
                        <div className="passo">
                            <p className="passo-p"><span>3.</span> Detalhes</p>
                        </div>
                        <form className="detalhes-form" action="">
                            <label htmlFor="titulo">Titulo</label>
                            <input
                                className="detalhes-input"
                                type="text"
                                name="titulo"
                                id="titulo"
                                ref={inputTitulo}
                                onInput={(e) => updateDraftState({ title: e.target.value })}
                            />
                            <label htmlFor="categoria">Categoria</label>
                            <select className="categoria-select" name="categoria" id="categoria"></select>

                            <label htmlFor="visibilidade">Visibilidade</label>
                            <select className="categoria-select" name="visibilidade" id="visibilidade"></select>
                        </form>
                    </div>

                    <div className="tags-box">
                        <div className="passo">
                            <p className="passo-p"><span>4.</span> Tags(max. 3)</p>
                        </div>
                        <div className="tags-inner">
                            {tags.map((dados) => (
                                <button
                                    type="button"
                                    className={`tag ${selectedTags.some((tag) => tag.id === dados.id) ? "tag-disabled" : ""}`}
                                    key={dados.id}
                                    onClick={() => handleSelectTag(dados)}
                                >
                                    #{dados.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tags-selecionadas">
                        <p className="tags-selecionadas-titulo">Selecionadas</p>
                        <div className="tags-selecionadas-lista">
                            {selectedTags.length > 0 ? (
                                selectedTags.map((tag) => (
                                    <div className="tag-selecionada" key={tag.id}>
                                        <span>#{tag.name}</span>
                                        <button
                                            type="button"
                                            className="tag-remove-btn"
                                            onClick={() => handleRemoveTag(tag.id)}
                                        >
                                            x
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="tags-selecionadas-vazio">Escolha ate 3 tags para o post.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="btn-criar-box">
                                <button className="new-cancelar" type="button" onClick={handleCancelClick}>Cancelar</button>
                                <button onClick={handleCreatePost} className="btn-publicar" type="button" disabled={loading}>
                                    <img src="/plane.png" alt="" className="publicar-icon" />
                                    {loading ? "Publicando..." : "Publicar"}
                                </button>
                            </div>

            <ConfirmModal
                isOpen={showExitModal}
                message="Voce tem alteracoes nao salvas. Deseja sair mesmo assim?"
                onConfirm={confirmExit}
                onCancel={() => setShowExitModal(false)}
            />
        </>
    )
}

export default CriarPost
