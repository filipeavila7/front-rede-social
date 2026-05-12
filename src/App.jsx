import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuthExpiredHandler from "./components/AuthExpiredHandler";
import PublicOnly from "./components/PublicOnly";
import RequireAuth from "./components/RequireAuth";
import Feed from "./pages/Feed";
import Perfil from "./pages/Perfil";
import Contatos from "./pages/Contatos";
import CriarPostPage from "./pages/CriarPostPage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Messages from "./pages/Messages";
import PerfilEditar from "./pages/PerfilEditar";
import Config from "./pages/Config";
import SeguidoresPage from "./pages/SeguidoresPage";
import SeguindoPage from "./pages/SeguindoPage";
import PostInner from "./pages/PostInner";
import OtherUserPage from "./pages/OtherUserPage";
import SeguidoresPageOther from "./pages/SeguidoresPageOther";
import SeguindoPageOther from "./pages/SeguindoPageOther";
import SearchPosts from "./pages/SearchPosts";
import Notifications from "./pages/Notifications";
import Esqueceu from "./pages/Esqueceu";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
      <AuthExpiredHandler />

      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueceu" element={<Esqueceu />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route index element={<Navigate to="/login" replace />} />
        <Route element={<RequireAuth />}>
          <Route path="/feed/:postId" element={<PostInner />} />
          <Route path="/contatos/:conversationId" element={<Messages />} />
          <Route path="/" element={<AppLayout />}>
            <Route path="feed" element={<Feed />} />
            <Route path="feed/search/:termo" element={<SearchPosts />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="perfil/editar" element={<PerfilEditar />} />
            <Route path="contatos" element={<Contatos />} />
            <Route path="posts" element={<CriarPostPage />} />
            <Route path="config" element={<Config />} />
            <Route path="perfil/followers" element={<SeguidoresPage />} />
            <Route path="perfil/follows" element={<SeguindoPage />} />
            <Route path="profile/:id/:userName/followers" element={<SeguidoresPageOther />} />
            <Route path="profile/:id/:userName/follows" element={<SeguindoPageOther />} />
           <Route path="/profile/:id/:userName" element={<OtherUserPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
