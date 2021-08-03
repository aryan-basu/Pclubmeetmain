import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyAVihggwV-iWKJDozK9eBa18N5tKeJqecg",
    authDomain: "login-d970e.firebaseapp.com",
    databaseURL: "https://login-d970e-default-rtdb.firebaseio.com",
    projectId: "login-d970e",
    storageBucket: "login-d970e.appspot.com",
    messagingSenderId: "499716605752",
    appId: "1:499716605752:web:37bb19df341143e8da63cd",
    measurementId: "G-MK64MTNLDX"
};
export const createUserProfileDocument = async(userAuth, additionalData) => {

    if (!userAuth) return;

    // console.log(firestore.doc(`pclubmeetuser/${userAuth.uid}`));

    const userRef = firestore.doc(`pclubmeetuser/${userAuth.uid}`);
    //console.log(userRef);
    const snapshot = await userRef.get();


    if (!snapshot.exists) {
        const { displayName, email, photoURL } = userAuth;
        const createdAt = new Date();
        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                photoURL,
                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }
    return userRef;


};
firebase.initializeApp(config);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();

provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => {

    auth.signInWithPopup(provider);

}
export default firebase;