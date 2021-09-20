import Post from "./post/post";
import { makeStyles, Typography } from "@material-ui/core";

//styles
const useStyle = makeStyles({
  root: {
    display: "grid",
    flex: "2.5",
    gridTemplateColumns: "repeat( auto-fit, minmax(250px, 400px) )",
    alignItems: "baseline",
    gridTemplateRows: "auto",
    justifyContent: "center",
    gap: "1rem",
  },
  empty: {
    flex: "2.5",
  },
});

//component
const Posts = ({ posts, getPosts, setEditedPost, setMode }) => {
  const classes = useStyle();
  return posts.length ? (
    <ul className={classes.root}>
      {posts.map((post) => {
        return (
          <Post
            setEditedPost={setEditedPost}
            setMode={setMode}
            getPosts={getPosts}
            post={post}
            key={post._id}
          ></Post>
        );
      })}
    </ul>
  ) : (
    <Typography className={classes.empty} variant="h4">
      Your memories list is empty, start adding {`:)`}
    </Typography>
  );
};

export default Posts;
