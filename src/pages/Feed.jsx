import StatusCard from "../components/StatusCards";
import PostContainer from "../components/PostContainer";
import '../styles/Feed.css'
function Feed() {
  return (
    <main className="conteudo-feed" >
      <StatusCard/>
      <PostContainer/>
    </main>
  );
}

export default Feed;
