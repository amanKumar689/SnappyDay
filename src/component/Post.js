import React, { useState ,useEffect } from "react";
import firebase from 'firebase'
import "../style/post.css";
import "../style/footer.css";
import comment_upload from '../firebase/comment_upload'
import heart from '../SVG/heart.png'
import redHeart from '../SVG/redHeart.png'
import Like_upload from '../firebase/Like_upload'
const Post = ({Auth,caption,username,imageURL,alt,id,Postusername,comments,count}) => {
  
console.log("COUNT:",count[0]?.username);
  const [comment,setComment] = useState([])
  const [clickStatus ,setClickStatus] = useState(true)
  const [likeStatus,setLikeStatus] =useState(false)
  
  useEffect(() => {
    
    count[0]?.username.map(name=>{
      name == username && setLikeStatus(true);
    })
   
  }, [count])
  
   
  return (
    <div className="post">
   
        <header>{Postusername} </header>
      <img src={ imageURL} alt={alt} />
      <footer>
        <section className="socialHAndler">
          {/* like */}
          {/* comment */}
        </section>
        <section className="caption">
         <p>  <strong> {Postusername}  <span> {caption}</span> </strong> <img src={likeStatus ?redHeart : heart}  onClick={()=>{
                
              if(clickStatus){
                  setClickStatus(false)               
           Like_upload(!likeStatus,id,username,Postusername).then(()=>{

        console.log("runn");
          setClickStatus(true)
           }
           ).catch(err=>{console.log(err)})
           ;setLikeStatus(!likeStatus);
           }
           }}/> 
        
         </p> <span style={{float:"right"}}>Like {count[0]?.count} </span> 
         <br /> <br/> comments  <br/><br/>
         {comments.map(comment=> <p> {comment.comment} </p>)}

           <br/> 
         </section>
        
     { Auth && (  <section  className="commentInput">
            <input type="text" placeholder="Add a comment" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
             <button onClick={ ()=>{
                 comment_upload(username,comment,id)
                
                  setComment("")
             }
              
              }>Post</button>
        </section>)
                  }
                  </footer>  
            
    
    </div>
  );
};

export default Post;
