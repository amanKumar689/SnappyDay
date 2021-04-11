import firebase from 'firebase'

const comment_upload = (username,comment,id)=>{
         firebase.firestore().collection('comments').add({

             

             comment:comment,
             username:username,
             id:id,
             Time: firebase.firestore.FieldValue.serverTimestamp()
            
         }).then(doxRef=>{
        }).catch(err=>{console.log(err);})

}
export default comment_upload;