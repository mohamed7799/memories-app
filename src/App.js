import Form from "./components/Form/form";
import Posts from "./components/Posts/posts";
import icon from "./assets/logo.svg";
import { Container, Typography, AppBar, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";

//styles
const useStyle = makeStyles({
  root: {
    minHeight: "100vh",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: ".5rem",
    padding: "1rem",
    borderRadius: "0px 0px 10px 10px",
  },
  content: {
    margin: "2rem 0rem",
    display: "flex",
    flexWrap: "wrap-reverse",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "3rem",
  },
});

//component
const App = () => {
  //state

  const [editedPost, setEditedPost] = useState("");
  const [mode, setMode] = useState("Add Memory");
  const [posts, setPosts] = useState([]);
  const [loadingFlag, setLoadingFlag] = useState(true);

  //functions

  const getPosts = async () => {
    const res = await fetch("https://memories-node-js.herokuapp.com/posts");
    if (!res.ok) {
      throw new Error("Bad response from server");
    }
    const { posts } = await res.json();
    setPosts(posts);
    return posts;
  };

  useEffect(() => {
    getPosts()
      .then(() => setLoadingFlag(false))
      .catch((err) => console.log(err));
  }, []);

  const classes = useStyle();

  return (
    <main className={classes.root}>
      <AppBar className={classes.header} position="static" color="inherit">
        <Typography variant="h4" component="h1">
          Memories
        </Typography>
        <img src={icon} alt="icon" height="30" width="30" />
      </AppBar>
      <Container maxWidth="lg">
        <section className={classes.content}>
          {loadingFlag && (
            <div
              style={{
                display: "flex",
                flex: "2.5",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                style={{ display: "block", width: "10%" }}
                src="https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif"
                alt="loading gif"
              />
            </div>
          )}
          {posts && !loadingFlag && (
            <Posts
              setEditedPost={setEditedPost}
              setMode={setMode}
              getPosts={getPosts}
              posts={posts}
            ></Posts>
          )}
          <Form
            editedPost={editedPost}
            setMode={setMode}
            mode={mode}
            getPosts={getPosts}
          ></Form>
        </section>
      </Container>
    </main>
  );
};

export default App;
