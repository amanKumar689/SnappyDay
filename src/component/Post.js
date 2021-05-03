import React, { useState, useEffect } from "react";
import "../style/post.css";
import "../style/footer.css";
import comment_upload from "../firebase/comment_upload";
import heart from "../SVG/heart.png";
import redHeart from "../SVG/redHeart.png";
import Like_upload from "../firebase/Like_upload";
const Post = ({
  Auth,
  caption,
  username,
  imageURL,
  alt,
  id,
  Postusername,
  comments,
  counts,
}) => {
  const [comment, setComment] = useState([]);
  const [clickStatus, setClickStatus] = useState(true);
  const [likeStatus, setLikeStatus] = useState(false);
  const [count, setCount] = useState(0);
  const [postShow, setPostShow] = useState(false);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    // Setting Count

    counts.length !== 0 &&
      counts.every((count) => {
        // Just iterating my Likes of post

        for (let index = 0; index < counts.length; index++) {
          let count = counts[index];
          if (id == count.id) {
            //   Checking For match

            // console.log("Count",count.count);
            setCount(count.count);
            //   console.log("Found in record",id);
            count.username.map((countUsername, index) => {
              countUsername == username && setLikeStatus(true);
            });
            break;
          } else if (counts.length - 1 == index) {
            setLikeStatus(false);
            setCount(0);
          }
        }
      });

    function gcd(a, b) {
      return b == 0 ? a : gcd(b, a % b);
    }

    var img = new Image();
    img.src = imageURL;
    img.onload = function () {
      const r = gcd(this.width, this.height);
      const [w, h] = [this.width / r, this.height / r];
      const rqr_height = h * (568 / w);
      // alert( rqr_height) ;
      setHeight(rqr_height);
      // console.log("image loaded");
    };
  }, [id, counts]);

  return (
    <>
      
      {height != null && (
        <div className="post">
          <header>{Postusername} </header>
          <img
            id="test"
            src={imageURL}
            alt={alt}
            onLoad={(e) => {
              e.target.style.height = height;
            }}
          />
          {/* this is the place where i want to  hold img size */}
          <footer>
            <section className="caption">
              <p>
                <strong>
                  {Postusername}
                  <span style={{ fontWeight: "lighter" }}> {caption}</span>
                </strong>
                {Auth && (
                  <img
                    src={likeStatus ? redHeart : heart}
                    onClick={() => {
                      if (clickStatus) {
                        setClickStatus(false);
                        Like_upload(!likeStatus, id, username, Postusername)
                          .then(() => {
                            setClickStatus(true);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                        setLikeStatus(!likeStatus);
                      }
                    }}
                  />
                )}
              </p>
              {Auth && <span style={{ float: "right" }}>Like {count} </span>}
              <br /> <br /> comments <br />
              <br />
              {comments.map((comment) => (
                <p> {comment.comment} </p>
              ))}
              <br />
            </section>

            {Auth && (
              <section className="commentInput">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    comment_upload(username, comment, id);

                    setComment("");
                  }}
                >
                  Post
                </button>
              </section>
            )}
          </footer>
        </div>
      )}
    </>
  );
};

export default Post;
