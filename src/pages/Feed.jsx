import StatusCard from "../components/StatusCards";
import PostContainer from "../components/PostContainer";
import '../styles/Feed.css'
import SearchBar from "../components/SearchBar";
function Feed() {
  return (
    <main className="conteudo-feed" >
      <SearchBar/>
      <PostContainer/>
    </main>
  );
}

export default Feed;
