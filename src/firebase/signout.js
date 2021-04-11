import firebase from 'firebase'

const signout =()=>{

    return new Promise((resolve,reject)=>{


        firebase.auth().signOut().then(user=>{
            resolve(user)
        }).catch(err=>{
            reject(err)
        })
    })

}
export default signout