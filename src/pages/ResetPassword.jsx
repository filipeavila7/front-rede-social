import { useSearchParams, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import api from "../service/api";
import "../styles/Login.css";
import Botao from "../components/Botao";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const inputSenha = useRef();

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    const [tempo, setTempo] = useState(null); // começa vazio

    const token = searchParams.get("token");

    async function resetSenhaPost(e) {
        e.preventDefault();

        setLoading(true);
        setMensagem("");
        setErro("");

        try {
            await api.post("/auth/reset-password", {
                token: token,
                novaSenha: inputSenha.current.value
            });

            setMensagem("Senha alterada com sucesso!");
            inputSenha.current.value = "";

            // inicia countdown de 5s
            setTempo(5);

        } catch (err) {
            console.log(err.response?.data);
            setErro(
                err.response?.data?.message ||
                "Erro ao redefinir senha"
            );
        } finally {
            setLoading(false);
        }
    }

    // controle do contador + redirect
    useEffect(() => {
        if (tempo === null) return;

        if (tempo <= 0) {
            navigate("/login");
            return;
        }

        const interval = setInterval(() => {
            setTempo((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);

    }, [tempo, navigate]);

    return (
        <div className='form-main-r'>
            <div className='container-e'>

                <form onSubmit={resetSenhaPost} className="form">

                    <label htmlFor="senha">Nova senha</label>

                    <div className="input-container">
                        <input ref={inputSenha} type="password" />
                        <img src="/lock.png" alt="" className="form-icon" />
                    </div>

                    <Botao type="submit" variant="primary" disabled={loading}>
                        {loading ? "Carregando..." : "Redefinir"}
                    </Botao>

                    {/* sucesso */}
                    {mensagem && (
                        <p style={{ color: "green", marginTop: "10px" }}>
                            {mensagem}
                        </p>
                    )}

                    {/* countdown */}
                    {tempo !== null && (
                        <p style={{ color: "#ffffff", marginTop: "10px" }}>
                            Redirecionando para login em <strong>{tempo}</strong>...
                        </p>
                    )}

                    {/* erro */}
                    {erro && (
                        <p style={{ color: "red", marginTop: "10px" }}>
                            {erro}
                        </p>
                    )}

                </form>

            </div>
        </div>
    );
}

export default ResetPassword;