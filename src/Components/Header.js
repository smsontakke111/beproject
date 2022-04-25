import React, { useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Button,
    Modal,
    Form,
    Input
  } from 'reactstrap';


  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {signInWithPopup , GoogleAuthProvider, getAuth} from 'firebase/auth';
import { useHistory } from 'react-router';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBog4exA2L1Ygr0Fs35ddoARKV3I-Zlszw",
  authDomain: "data-compression-f9fb5.firebaseapp.com",
  projectId: "data-compression-f9fb5",
  storageBucket: "data-compression-f9fb5.appspot.com",
  messagingSenderId: "468597739769",
  appId: "1:468597739769:web:52e8b25333818010f19228",
  measurementId: "G-NXKHZ3VK62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const authentication = getAuth(app);



const Header = (props) => {
            const [isOpen, setIsOpen] = useState(false);
          
            const toggle = () => setIsOpen(!isOpen);

            const history = useHistory();

            const Gsignin = () => {
                const provider = new GoogleAuthProvider();
                signInWithPopup(authentication , provider)
                .then((re) => {
                    console.log(re.user);
                    props.setUser(re.user);
                    history.push('/temp');

                })
                .catch(err => console.log(err));
            }            

            const logoutHandler = () => {

                props.setUser(null);
                history.push('/home');
            }
          
            return (
                <>
                    
                    <div >
                        
                            <Navbar style={{ backgroundColor: 'rgb(107, 15, 117)' }} dark expand='lg' className='p-4'>
                            <NavbarBrand href="/" className="mr-auto"><h3 style={{fontFamily:"sans-serif",letterSpacing:"1px"}}>Don't Stress, Compress</h3></NavbarBrand>
                            <NavbarToggler onClick={toggle} className="mr-2 ml-auto" />
                            <Collapse isOpen={isOpen} navbar className=' row'>

                                <Nav navbar className='col-12 col-lg-3 offset-lg-7 '>
                                    {
                                        props.user ? (
                                            <>
                                            
                                            <NavItem>
                                                <NavLink className='mx-2 nav-link'  >
                                                    <div>
                                                        <center>
                                                            <img style={{height:"50px"}}  src={props.user.photoURL} className="img-fluid rounded-circle"  />
                                                            <br/>
                                                            {props.user.displayName}
                                                        </center>
                                                    </div>
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink style={{marginLeft:"60px"}} className='mt-4 nav-link'  ><Button onClick={logoutHandler}>Logout</Button></NavLink>
                                            </NavItem>
                                            </>
                                        ) : (
                                            <NavItem>
                                                <NavLink className='mx-2 nav-link' to='/Mars' ><Button onClick={Gsignin} color='danger' style={{color:'white'}} className='rounded'  ><i className="fa fa-lg fa-google"></i> SignIn</Button></NavLink>
                                            </NavItem>
                                        )
                                    }
                                    
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
              </>
    );
}

export default Header;