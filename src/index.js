import {initializeApp} from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc

}    from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyAy8x6iDZeRvZaQBY-mBbRtMDwhGkV2Jpo",
    authDomain: "fir-9-cce7e.firebaseapp.com",
    projectId: "fir-9-cce7e",
    storageBucket: "fir-9-cce7e.appspot.com",
    messagingSenderId: "900123645443",
    appId: "1:900123645443:web:977e38167accb797ade036"
  };

//init  firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();
const auth = getAuth();

//colection ref
const colRef = collection(db, 'books');

//queries
const q = query(colRef, orderBy('createdAt'));


// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//         books.push({...doc.data(), id:doc.id});
//     });
//     console.log(books);
//   })
//   .catch(err =>console.log(err));

//real time colection data
const unsubCol = onSnapshot(q,(snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({...doc.data(), id:doc.id});
    });
    console.log(books);
}) 

// adding docs
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
})

// deleting docs
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value);//local variabila

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    });
})  ;

//get a single doc
const docRef = doc(db, 'books', 'HLOS1WNINMC9mGt808cZ');

// getDoc(docRef)
//   .then((doc) => {
//     console.log(doc.data(), doc.id);
//   });
 
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});  


// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const docRef = doc(db, 'books', updateForm.id.value);

  updateDoc(docRef, {
    title: 'updated title'
  })
  .then(() => {
    updateForm.reset();
  })
});

// signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const passwword = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, passwword)
  .then((cred) =>{
    //console.log('user created', cred.user);
    signupForm.reset();
  })
  .catch(err => console.log(err.message)); 

})

// logging in and out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
  signOut(auth)
  .then(()=>{
    //console.log('user signed out');
  })
  .catch(err => console.log(err.message)); 
})

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //console.log('user logged in', cred.user);
    })
    .catch(err => console.log(err.message)); 

})

//sub to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user);
});

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
})