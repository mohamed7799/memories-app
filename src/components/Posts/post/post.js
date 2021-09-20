import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  CardMedia,
  Button,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import moment from "moment";

//styles
const useStyle = makeStyles({
  root: {
    position: "relative",
    borderRadius: "10px",
  },
  media: {
    height: "150px",
  },
  overlay: {
    display: "flex",
    justifyContent: "space-between",
    position: "absolute",
    backgroundColor: "#00000059",
    top: "0",
    left: "0",
    right: "0",
    height: "150px",
    padding: ".5rem",
    color: "white",
  },
  delete: {
    display: "flex",
    marginLeft: "auto",
  },
  edit: {
    height: "fit-content",
    justifyContent: "flex-end",
    color: "white",
    padding: "0",
    marginTop: "5px",
    "&:hover": {
      background: "none",
    },
  },
});

//component
const Post = ({ post, getPosts, setEditedPost, setMode }) => {
  const classes = useStyle();

  //functions
  const deleteFetch = async () => {
    const res = await fetch(
      `https://memories-node-js.herokuapp.com/posts/${post._id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Bad response from server");
    }

    return res.json();
  };

  const deletePost = () => {
    deleteFetch()
      .then(() => {
        getPosts();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={post.selectedFile}
        title="Contemplative Reptile"
      />
      <div className={classes.overlay}>
        <div>
          <Typography variant="h6">{post.creator}</Typography>
          <Typography variant="body2">
            {moment(post.createdAt).fromNow()}
          </Typography>
        </div>
        <Button
          onClick={() => {
            setEditedPost(post);
            setMode("Edit");
          }}
          className={classes.edit}
          startIcon={<EditIcon></EditIcon>}
        ></Button>
      </div>
      <CardContent>
        <Typography color="textSecondary" variant="subtitle1">
          {`#${post.tags.join(" #")}`}
        </Typography>
        <Typography variant="h5">{post.title}</Typography>
        <Typography
          style={{ margin: "1rem 0rem" }}
          color="textSecondary"
          variant="subtitle2"
        >
          {post.message}
        </Typography>

        <Button
          className={classes.delete}
          onClick={deletePost}
          startIcon={<DeleteIcon></DeleteIcon>}
          color="secondary"
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

export default Post;
