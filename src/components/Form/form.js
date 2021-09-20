import FileBase from "react-file-base64";
import loading from "../../assets/loading.gif";
import { Button, TextField, Typography, makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";

//styles
const useStyle = makeStyles({
  root: {
    backgroundColor: "white",
    flex: "1",
    padding: "1rem",
    borderRadius: "10px",
    boxShadow: "0px 0px 5px 5px #bbbbbb2e",
    "& > *": {
      marginBottom: "1rem",
    },
  },
});

//component
const From = ({ getPosts, mode, setMode, editedPost }) => {
  //state
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [formError, setFormError] = useState({
    creator: false,
    title: false,
    message: false,
    selectedFile: false,
    tags: false,
  });
  const [postData, setPostData] = useState({
    creator: "",
    title: "",
    message: "",
    selectedFile: "",
    tags: "",
  });

  //funtions

  const HandleFormChange = (e) => {
    const key = e.target.name;
    if (key === "tags") {
      setPostData({ ...postData, [key]: e.target.value.split(",") });
    } else {
      setPostData({ ...postData, [key]: e.target.value });
    }
    setFormError({ ...formError, [key]: false });
  };

  const validateForm = () => {
    let error = false;
    for (const property in postData) {
      if (postData[property] === "") {
        error = { ...error, [property]: true };
      }
    }
    setFormError({ ...formError, ...error });
    return error;
  };

  const postFetch = async () => {
    const res = await fetch("https://memories-node-js.herokuapp.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!res.ok) {
      throw new Error("Bad response from server");
    }

    return res.json();
  };

  const addPost = () => {
    if (!validateForm()) {
      setLoadingFlag(true);
      postFetch()
        .then(() => {
          setLoadingFlag(false);
          getPosts();
          setPostData({
            creator: "",
            title: "",
            message: "",
            selectedFile: "",
            tags: "",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const EditFetch = async () => {
    const res = await fetch(
      `https://memories-node-js.herokuapp.com/posts/${editedPost._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );

    if (!res.ok) {
      throw new Error("Bad response from server");
    }
    return res;
  };

  const editPost = () => {
    if (!validateForm()) {
      setLoadingFlag(true);
      EditFetch()
        .then(() => {
          setLoadingFlag(false);
          setMode("Add Memory");
          getPosts();
        })
        .then(() =>
          setPostData({
            creator: "",
            title: "",
            message: "",
            selectedFile: "",
            tags: "",
          })
        )
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setFormError({ ...formError, selectedFile: false });
  }, [postData.selectedFile]);

  useEffect(() => {
    setPostData({ ...postData, ...editedPost });
  }, [editedPost]);

  const classes = useStyle();
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={classes.root}
      autoComplete="off"
      noValidate
    >
      <Typography align="center" variant="h6">
        {"Creating a Memory"}
      </Typography>
      <TextField
        disabled={loadingFlag}
        error={formError.creator}
        value={postData.creator}
        onChange={HandleFormChange}
        name="creator"
        variant="outlined"
        label="Creator"
        helperText={!postData.creator ? "the field is empty" : ""}
        fullWidth
      ></TextField>
      <TextField
        disabled={loadingFlag}
        error={formError.title}
        helperText={!postData.title ? "the field is empty" : ""}
        value={postData.title}
        onChange={HandleFormChange}
        name="title"
        variant="outlined"
        label="Title"
        fullWidth
      ></TextField>
      <TextField
        disabled={loadingFlag}
        error={formError.message}
        helperText={!postData.message ? "the field is empty" : ""}
        value={postData.message}
        onChange={HandleFormChange}
        name="message"
        variant="outlined"
        label="Message"
        multiline
        minRows="4"
        fullWidth
      ></TextField>
      <TextField
        disabled={loadingFlag}
        error={formError.tags}
        helperText={!postData.tags ? "the field is empty" : ""}
        value={postData.tags}
        onChange={HandleFormChange}
        name="tags"
        variant="outlined"
        label="Tags (comma separated)"
        fullWidth
      ></TextField>
      <FileBase
        name="selectedFile"
        style={{ fontFamily: "Roboto" }}
        type="file"
        multiple={false}
        onDone={({ base64 }) => {
          setPostData({ ...postData, selectedFile: base64 });
        }}
      ></FileBase>
      {formError.selectedFile && (
        <Typography variant="subtitle1" style={{ color: "red" }}>
          Please choose an image
        </Typography>
      )}
      {loadingFlag && (
        <img
          style={{ display: "block", margin: "1rem auto" }}
          src={loading}
          alt="loading gif"
        />
      )}

      <Button
        onClick={mode === "Add Memory" ? addPost : editPost}
        variant="contained"
        color="primary"
        fullWidth
      >
        {mode}
      </Button>
      <Button
        onClick={() => {
          setPostData({
            creator: "",
            title: "",
            message: "",
            selectedFile: "",
            tags: "",
          });
        }}
        variant="contained"
        color="secondary"
        fullWidth
      >
        Clear
      </Button>
    </form>
  );
};

export default From;
