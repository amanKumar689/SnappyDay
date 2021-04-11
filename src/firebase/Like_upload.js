import firebase from "firebase";

const Like_upload = (likeStatus, id, username, Postusername) => {
  // console.log("ID:",likeStatus,id,username,Postusername);
 
  return new Promise((resolve,reject)=>{

    firebase
    .firestore()
    .collection("Likes")
    .doc(id)
    .get()
    .then((doc) => {
    //   console.log(doc.data());
      firebase
        .firestore()
        .collection("Likes")
        .doc(id)
        .set({
          count: likeStatus
            ? doc.data()?.count == undefined
              ? 1
              : ++doc.data().count
            : doc.data()?.count != undefined
            ? --doc.data().count
            : 0,
          username:likeStatus ? (doc.data()?.username== undefined ? [username]: [...doc.data().username , username]) 
                              : (doc.data()?.username== undefined ? "null":doc.data().username.filter(name=>name!=username)) 
           
        })
        .then((doxRef) => {
        //   console.log("add liked");
        resolve();
        })
        .catch((err) => {
          console.log(err);
          reject(err)
        });
    })
    .catch((err) => {
      console.log(err);
    });

  })
   
 
};
export default Like_upload;
