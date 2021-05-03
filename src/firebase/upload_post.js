import firebase from "firebase";

const upload_post = (file, username, caption, progressHandler) => {
  return new Promise((resolve, reject) => {
    file == null && reject("Choose file first");
    // firestore +  storage
    var db = firebase.firestore();
    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    const UploadTask = storageRef.child("images/" + file.name).put(file);

    // Available at downloadurl
    UploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        progressHandler(progress);
      },
      (err) => {
        console.log(err);
      },
      () => {
        UploadTask.snapshot.ref.getDownloadURL().then((download) => {
          // database management

          db.collection("Post")
            .add({
              caption: caption,
              username: username,
              imageURL: download,
              alt: file.name,
              Time: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((docRef) => {
              resolve(0 ,docRef);
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        });
      }
    );
  });
};

export default upload_post;
