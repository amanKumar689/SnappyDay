import React, { useEffect, useState } from "react";
import "./firebase/config";
import firebase from "firebase";
import "./style/header.css";
import "./style/app.css";
import Avatar from "@material-ui/core/Avatar";
import "./style/post_body.css";
import upload from "./upload_file.svg";
import post from "./post.svg";
import Modal from "@material-ui/core/Modal";
import signup from "./firebase/signup";
import login from "./firebase/login";
import signout from "./firebase/signout";
import upload_post from "./firebase/upload_post";
import Post from "./component/Post";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Skelton from "./component/Skelton";
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});
const InstaApp = () => {
  const classes = useStyles();
  const [comments, setComments] = useState([]);

  const [loginOpen, set_Login_Open] = useState(false);
  const [signUpOpen, set_SignUp_Open] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [Auth, setAuth] = useState(null);
  const [appear, setAppear] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState(false);
  const [counts, setCounts] = useState([]);
  const [limit, setLimit] = useState(1);
  const [max, setMax] = useState(1);
  const [message, setmessage] = useState({
    message: null,
    error: null,
    severity: null,
    open: false,
  });
  const style = {
    appear: {
      display: "block",
    },
  };

  //  ProgressBar

  const progressHandler = (val) => {
    setProgress(val);
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            {...props}
            style={{ height: "7px", borderRadius: "10px" }}
            color="secondary"
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  // Alert Handler

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setmessage({ ...message, open: false });
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const upload_file_Handler = (e) => {
    e.target.style.width = "auto";
    setFile(e.target.files[0]);
    // console.log(e.target.files[0]);
  };

  // single run

  useEffect(() => {
    // Setting max size for post

    const Run = () => {
      let max_var = 0;
      firebase
        .firestore()
        .collection("Post")
        .get()
        .then((doc) => {
          doc.forEach((val) => {
            max_var += 1;
          });
          setMax(max_var);
        })
        .catch((err) => {
          console.log(err);
        });

      // Fetching first Time
      let post_var = [];
      firebase
        .firestore()
        .collection("Post")
        .orderBy("Time", "desc")
        .limit(1)
        .get()
        .then((doc) => {
          doc.forEach((val) => {
            post_var.push(val);
          });
          setPosts(post_var);
        })
        .catch((err) => {
          console.log(err);
        });

      // javascript sticky nature

      // AUth change lisiteners

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          setmessage({
            ...message,
            open: true,
            message: "You are Successfully Logged In",
            severity: "success",
          });

          setAuth(true);
          setUsername(user.displayName);
        } else {
          setAuth(false);
        }
      });

      // Fetching Post from database

      // Fetch Likes

      firebase
        .firestore()
        .collection("comments")
        .orderBy("Time")
        .onSnapshot((commentSnap) => {
          // console.log("comments:",comments );

          // console.log("ONsnap:",id)
          let Comment_var = [];
          commentSnap.forEach((EachComment) => {
            Comment_var.push(EachComment.data());
          });

          setComments(Comment_var);
        });

      // Let's Fetch the Like

      firebase
        .firestore()
        .collection("Likes")
        .onSnapshot((doc) => {
          let Likes = [];
          doc.forEach((eachDoc) => {
            // console.log(eachDoc.data());
            Likes.push({
              id: eachDoc.id,
              count: eachDoc.data().count,
              username: eachDoc.data().username,
            });
          });
          setCounts(Likes);
        });
    };
    Run();
    return Run;
  }, [max]);

  // 2nd UseEffect

  useEffect(() => {
    const fun = () => {
      const Fetch_by_limit = () => {
        firebase
          .firestore()
          .collection("Post")
          .limit(limit)
          .orderBy("Time", "desc")
          .get()
          .then((doc) => {
            let post_var = [];
            doc.forEach((eachDoc) => {
              post_var.push(eachDoc);
              //  console.log("DOC:",eachDoc.data());
            });
            setPosts(post_var);
          })
          .catch((err) => {
            console.log(err);
          });
      };

      Fetch_by_limit();

      document.getElementById("root").onscroll = () => {
        if (document.getElementById("root").scrollTop >= 40) {
          document.getElementById("header").style.padding =
            "15px 25px 9px 15px";
        } else {
          document.getElementById("header").style.padding =
            "15px 25px 19px 15px";
        }

        if (
          document.getElementById("root").scrollHeight - window.innerHeight <=
          document.getElementById("root").scrollTop + 10
        ) {
          Fetch_by_limit();

          limit <= max && setLimit((prev) => prev + 1);
        }
      };
    };
    fun();
    return fun;
  }, [limit]);

  return (
    <div className="Instagram" id="Instagram">
      <Snackbar
        open={message.open}
        autoHideDuration={4000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={message.severity}>
          {message.message}
        </Alert>
      </Snackbar>
      <Modal
        open={signUpOpen}
        onClose={() => {
          set_SignUp_Open(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <div className="Modal">
            <form>
              <input
                type="text"
                name=""
                id=""
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                type="email"
                name=""
                id=""
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                name=""
                id=""
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="button"
                value="Sign Up"
                id="sign_up_btn"
                onClick={() => {
                  signup(email, password, username)
                    .then((username) => {
                      setUsername(username);
                    })
                    .catch((err) => {
                      setmessage({
                        ...message,
                        open: true,
                        message: err,
                        severity: "error",
                      });
                    });
                  set_SignUp_Open(false);
                }}
              />
            </form>
          </div>
        }
      </Modal>
      <Modal
        open={loginOpen}
        onClose={() => {
          set_Login_Open(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <div className="Modal">
            <form>
              <input
                type="email"
                name=""
                id=""
                placeholder="Email"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                type="password"
                name=""
                id=""
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <input
                type="button"
                value="Log In"
                id="login_btn"
                onClick={() => {
                  login(username, password)
                    .then()
                    .catch((err) => {
                      setmessage({
                        open: true,
                        message: err.message,
                        severity: "error",
                      });
                    });
                  set_Login_Open(false);
                }}
              />
            </form>
          </div>
        }
      </Modal>
      <header id="header">
        <div className="logo">
          <p style={{ fontFamily: "Dancing Script", fontSize: "20px" }}>
            SnappyDay
          </p>
        </div>
        <div className={` "Authhandler " +  ${Auth ? "" : "Btn_version"} `}>
          {Auth != null &&
            (Auth ? (
              <>
                <Avatar
                  alt={username && username}
                  src="/static/images/avatar/1.jpg"
                  onClick={() => {
                    !appear ? setAppear(true) : setAppear(false);
                  }}
                />
                <span
                  style={appear ? style.appear : null}
                  onClick={() => {
                    signout().then(() => {
                      setmessage({
                        ...message,
                        open: true,
                        message: "You are Logged out !!!",
                        severity: "success",
                      });
                     setUsername("") 
                    });
                  }}
                >
                  Log out
                </span>
              </>
            ) : (
              <>
                <button
                  className="signup"
                  onClick={() => {
                    set_SignUp_Open(true);
                    setAppear(false);
                  }}
                >
                  Sign up
                </button>
                <button
                  className="login"
                  onClick={() => {
                    set_Login_Open(true);
                    setAppear(false);
                  }}
                >
                  Log In
                </button>
              </>
            ))}
        </div>
      </header>

     {  Auth && ( <div className="posthandler">
        <br />
        <div className="choose_wrapper">
          <img src={upload} alt="" />
          <input
            type="file"
            name=""
            id="file"
            onChange={(e) => {
              upload_file_Handler(e);
            }}
          />
        </div>
        <div className={classes.root}>
          {progressStatus && <LinearProgressWithLabel value={progress} />}
        </div>
        <div className="captionHandler">
          <input
            type="text"
            name=""
            value={caption}
            id="caption"
            placeholder="Add a caption"
            onChange={(e) => {
              setCaption(e.target.value);
            }}
          />
          <img
            src={post}
            onClick={() => {
              setProgressStatus(true);
              upload_post(file, username, caption, progressHandler)
                .then((prog) => {
                  setProgressStatus(false);
                  setmessage({
                    ...message,
                    open: true,
                    message: "Uploaded Successfully",
                    severity: "success",
                  });
                  setProgress(prog);
                  document.getElementById("file").value = null;
                  setCaption("");
                  setLimit((prev) => prev + 1);
                  // console.log("solved");
                })
                .catch((err) => {
                  setmessage({
                    ...message,
                    open: true,
                    message: err,
                    severity: "error",
                  });
                });
            }}
          />
        </div>
      </div> )
      }
      <div className="post_body">
        {posts ? (
          posts.map((Eachpost, index) => (
            <Post
              Auth={Auth}
              comments={comments.filter((comment) => comment.id == Eachpost.id)}
              key={index}
              id={Eachpost.id}
              caption={Eachpost.data().caption}
              username={username}
              Postusername={Eachpost.data().username}
              imageURL={Eachpost.data().imageURL}
              count={counts.filter((count) => {
                // console.log("MAPPP",count)
                if (Eachpost.id == count.id) {
                  return count;
                }
              })}
              alt={Eachpost.data().alt}
            />
          ))
        ) : (
          <Skelton />
        )}
      </div>
    </div>
  );
};

export default InstaApp;
