import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuthExpiredHandler from "./components/AuthExpiredHandler";
import PublicOnly from "./components/PublicOnly";
import RequireAuth from "./components/RequireAuth";
import Feed from "./pages/Feed";
import Perfil from "./pages/Perfil";
import Contatos from "./pages/Contatos";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Messages from "./pages/Messages";
import PerfilEditar from "./pages/PerfilEditar";
import Config from "./pages/Config";
import SeguidoresPage from "./pages/SeguidoresPage";
import SeguindoPage from "./pages/SeguindoPage";
import PostInner from "./pages/PostInner";

function App() {
  return (
    <>
      <AuthExpiredHandler />

      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Route>
        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<RequireAuth />}>
          <Route path="/feed/:postId" element={<PostInner />} />
          <Route path="/contatos/:conversationId" element={<Messages />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="feed" element={<Feed />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="perfil/editar" element={<PerfilEditar />} />
            <Route path="contatos" element={<Contatos />} />
            <Route path="posts" element={<Posts />} />
            <Route path="config" element={<Config />} />
            <Route path="perfil/followers" element={<SeguidoresPage />} />
            <Route path="perfil/follows" element={<SeguindoPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
