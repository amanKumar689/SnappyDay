import React, { useEffect, useRef, useState } from "react";
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
  const [lastVisible, setLastVisible] = useState(null);
  const [loginOpen, set_Login_Open] = useState(false);
  const [signUpOpen, set_SignUp_Open] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [Auth, setAuth] = useState(null);
  const [appear, setAppear] = useState(false);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [posts, setPosts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState(false);
  const [counts, setCounts] = useState([]);
  const [snapActive, setSnapActive] = useState(false);
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

  const sendBtnRef = useRef();

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
  };

  // Snapshot for updated data when uploading

  useEffect(() => {             
    var unsubcribe = firebase
      .firestore()
      .collection("Post")
      .onSnapshot((snapshot) => {
      // console.log("");
        const post_var = [];
        snapshot.docChanges().length ==1 && snapshot.docChanges().forEach((doc) => {
          // first listen for  snapshot -- docChanges() gives  DOCS -- type = added || remove || modified
         
          doc.type === 'added' &&  post_var.push(doc.doc);

        });

        setPosts((prevState) => {
          return [...post_var, ...prevState];
        });
      });

    return unsubcribe;
  }, []);

  // includes ::-   Fetching first time with limit && Auth listener &&    Like snapshot   &&   Comment Snapshot

  useEffect(() => {
    const Run = () => {
      // Fteching Post first time limit - 5
      let post_var = [];
      firebase
        .firestore()
        .collection("Post")
        .orderBy("Time", "desc")
        .limit(5)
        .get()
        .then((doc) => {
          doc.forEach((val) => {
            post_var.push(val);
            console.log("limit");
          });
          setPosts(post_var);
          var lastVisible = doc.docs[doc.docs.length - 1];
          setLastVisible(lastVisible);
        })
        .catch((err) => {
          console.log(err);
        });

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

      // Fetch Comments Live snapshot

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

      // Fetch the Like Live snapshot

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
  }, []);

  //  Run After scroll down to bottom

  useEffect(() => {
    const fun = () => {
      const Fetch_by_limit = () => {
        lastVisible != undefined &&
          firebase
            .firestore()
            .collection("Post")
            .orderBy("Time", "desc")
            .startAfter(lastVisible)
            .limit(5)
            .get()
            .then((doc) => {
              let post_var = [];
              doc.forEach((eachDoc) => {
                post_var.push(eachDoc);
              });
              setPosts((prevState) => {
                return [...prevState, ...post_var];
              });
              var lastDoc = doc.docs[doc.docs.length - 1];
              lastDoc != undefined && setLastVisible(lastDoc);
            })
            .catch((err) => {
              console.log("err", err);
            });
      };

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
        }
      };
    };
    fun();
    return fun;
  }, [lastVisible]);
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
                      setUsername("");
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

      {Auth && (
        <div className="posthandler">
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
              onKeyPress={(e) => {
                e.key === "Enter" && sendBtnRef.current.click();
              }}
            />
            <img
              ref={sendBtnRef}
              src={post}
              onClick={() => {
                setProgressStatus(true);
                upload_post(file, username, caption, progressHandler) //         upload handler...............
                  .then((prog, docRef) => {
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
                  })
                  .catch((err) => {
                    setProgressStatus(false);
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
        </div>
      )}
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
              counts={counts}
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
