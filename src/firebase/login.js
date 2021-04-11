import firebase from 'firebase'
  const login = (email,password)=>{
   return new Promise((resolve,reject)=>{

    firebase.auth().signInWithEmailAndPassword(email,password)
    .then(user=>{
        resolve(user)
    })
    .catch(err=>{
        reject(err)
    })



   })
    
}

export default login

// Fetch Post from Databasae