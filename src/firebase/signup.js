import firebase from 'firebase'
const signup = (email , password, username)=>{

  return new Promise((resolve,reject)=>{
 
     if(username!="")
     {

       
       firebase.auth().createUserWithEmailAndPassword(email,password)
    .then( ()=>{
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: username,
      }).then(function() {
        // Update successful.
        resolve(username)
      }).catch(function(error) {
        // An error happened.
      });
      
      //  console.log(user);
    } )
    .catch(err=>{
      reject(err.message)
      
    })
    
  }
 else
 {
   reject("Please fill up detail correctly")
 }

  })
  
  

}
export default signup