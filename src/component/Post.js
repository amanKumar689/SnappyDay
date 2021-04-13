import React, { useState ,useEffect } from "react";
import "../style/post.css";
import "../style/footer.css";
import comment_upload from '../firebase/comment_upload'
import heart from '../SVG/heart.png'
import redHeart from '../SVG/redHeart.png'
import Like_upload from '../firebase/Like_upload'
const Post = ({Auth,caption,username,imageURL,alt,id,Postusername,comments,counts}) => {
  

  const [comment,setComment] = useState([])
  const [clickStatus ,setClickStatus] = useState(true)
  const [likeStatus,setLikeStatus] =useState(false)
const [count ,setCount] =useState(0);
     
  useEffect(() => {
     
 
    // Setting Count 
   
    counts.length!=0 &&   counts.every((count) => {       
       // Just iterating my Likes of post
  
       for (let index = 0; index < counts.length; index++) {
      let count = counts[index]
         if (id == count.id) {         
        //   Checking For match
      
        // console.log("Count",count.count);
        setCount(count.count)
        //   console.log("Found in record",id);
         count.username.map((countUsername ,index)=>{
            countUsername == username && setLikeStatus(true) 
          
          })
        break;
        }
        else if(counts.length -1 == index)
        { 
          setLikeStatus(false)
          setCount(0)
         
        }
       

       }

  })  
 
 
  }, [id,counts])
  
   
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

          setClickStatus(true)
           }
           ).catch(err=>{console.log(err)})
           ;setLikeStatus(!likeStatus);
           }
           }}/> 
        
         </p> <span style={{float:"right"}}>Like {count} </span> 
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
