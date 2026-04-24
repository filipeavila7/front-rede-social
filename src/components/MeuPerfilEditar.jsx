import "../styles/Perfil.css";
import api from "../service/api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function MeuPerfilEditar() {
  const [myProfile, setMyprofile] = useState(null);
  const [previewImagem, setPreviewImagem] = useState(null);
  const [imageUrlProfile, setImageUrlProfile] = useState(null);
  const [meId, setMeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const imputNovoNome = useRef();
  const imputNovaBio = useRef();

  async function getMyProfile() {
    try {
      const res = await api.get("/profiles/me");
      setMyprofile(res.data);
      setImageUrlProfile(res.data.imageUrlProfile || null);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMePut() {
    try {
      const res = await api.get("/users/me");
      const id = res.data?.id ?? null;
      setMeId(id);
      return id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImagem(previewUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrlProfile(res.data.url);
    } catch (error) {
      console.log(error);
    }
  }

  async function putUserName(id) {
    try {
      await api.put(`/users/${id}`, {
        nome: imputNovoNome.current.value || myProfile.nome,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function putPerfil() {
    try {
      await api.put("/profiles/me", {
        bio: imputNovaBio.current.value || myProfile.bio,
        imageUrlProfile: imageUrlProfile || myProfile.imageUrlProfile,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function handleSalvar() {
    try {
      if (!meId || !myProfile) return;

      setLoading(true);

      await putUserName(meId);
      await putPerfil();

      await getMyProfile();
      navigate("/perfil");
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMyProfile();
    getMePut();
  }, []);

  return (
    <>
      {myProfile && (
        <div className="edit-container">
          <div className="img-edit-container">
            <img
              className="img-edit"
              src={previewImagem || imageUrlProfile || myProfile.imageUrlProfile || '/null.png' }
              alt=""
            />
            <input onChange={handleImageChange} type="file" />
          </div>

          <div className="profile-edit">
            <p>Nome:</p>
            <input
              className="profile-edit-input"
              type="text"
              defaultValue={myProfile.nome}
              ref={imputNovoNome}
            />
          </div>

          <div className="profile-edit">
            <p>Bio:</p>
            <textarea
              className="profile-edit-input"
              defaultValue={myProfile.bio}
              ref={imputNovaBio}
            />
          </div>

          <div className="buttons-container">
            <button
              onClick={() => navigate("/perfil")}
              className="cancelar"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              onClick={handleSalvar}
              className="salvar"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MeuPerfilEditar;