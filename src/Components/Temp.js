import React, { useEffect, useState }  from 'react';
import { Button, Card, Table, Form, Input, InputGroup, Label , Dropdown , DropdownItem , DropdownMenu , DropdownToggle } from 'reactstrap';
import '../App.css';
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import { getFirestore } from "firebase/firestore";
  import { getStorage, ref, uploadBytesResumable, getDownloadURL , listAll } from "firebase/storage";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';
  
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
  
  
  


const Temp = (props) => {

    const [isProcess,setisProcess] = useState(false);

    const [load,setLoad] = useState(false);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [fileNames , setfileNames] = useState([]);

    const [dURL,setdURL] = useState("");

    const history = useHistory();

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const Process = (e) => {
        // setLoad(true);
        // setTimeout(() => {
        //     setLoad(false);
        //     setisProcess(!isProcess);
        // } , 5000);
        e.preventDefault();
        console.log(e.target.file.files[0]);

        if(props.user)
        {
            const storage = getStorage();
  
            var uname = props.user.email;
            uname = uname.split('@')[0];
            
            // Create the file metadata
            /** @type {any} */
            const metadata = {
                uname: uname
            };
            
            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'files/' +uname + "$" +e.target.file.files[0].name );
            const uploadTask = uploadBytesResumable(storageRef,e.target.file.files[0] , metadata);
            

            
            uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setdURL(downloadURL);
                setisProcess(!isProcess);
                });
            }
            );
        }
        else{
            Swal.fire("","Login First !" ,"warning");
        }
        

        
        
}

useEffect(()=>{
    if(!props.user)
        history.push('/home');


},[]);

useEffect(()=>{

    const storage = getStorage();
    var fnames = [];
    // Create a reference under which you want to list
    const listRef = ref(storage, 'files/');
        listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {

        
        // All the items under listRef.
        var x = itemRef._location.path;

        x = x.split("/")[1];

        var y = x.split("$")[1];

        x = x.split("$")[0];
        

        var uname = props.user.email;
        uname = uname.split('@')[0];

        if(x == uname)
        {
            fnames.push(y);
        }

        
        });
    })
    .then(() => {
        
        setfileNames(fnames);
    }).catch((error) => {
        // Uh-oh, an error occurred!
        console.log(error);
    });

    

},[isProcess]);

useEffect(()=>{

    console.log(fileNames);

},[fileNames]);

    useEffect(()=>{} , [setisProcess , setLoad]);

    const filelist = fileNames.map((f,i) => {
        return(
            <tr>
                <th scope="row">
                    {i+1}
                </th>
                <td>
                    {f}
                </td>
                <td>
                    04/12/2012
                </td>
                <td>
                    10 kb
                </td>

            </tr>
        );
    })


    return (
        <div>
            <div className='col-12 p-5 background' >
            <center>
                <h1 style={{color: 'white'}}>Easily Compress Files in Seconds !</h1>
                <br/>
                <br/>

                <div className='container p-2 ' >
                    <Form onSubmit={Process}> 
                            <Input className='m-2' onChange={() => setisProcess(false)} name='file'  type='file' style={{width:'320px'}} />
                                
                                <br/><br/>
                            <Button className='m-2 rounded col-3' color='danger' type="submit" style={ isProcess ? {display:'none'} : {display : 'block'}} >Upload</Button>
                            <a href={dURL} target="_blank" style={{textDecoration:"none"}}><Button type="button" className='m-2 rounded col-3' color='danger' style={ isProcess ? {display:'block'} : {display : 'none'}} >Download</Button></a>
                            <br/><br/>

                                <div class="spinner-border" role="status" style={ load ? { display:'block',  color:'white' , fontSize: '50%' } : { display:'none',  color:'white' , fontSize: '50%' }}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                        
                        
                            
                            
                        
                    </Form>
                </div>

                <div className='container p-4'>
                    <h5 style={{ float:'left' , color:'white'}}>Earlier</h5>

                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} style={{float : 'right'}}>
                            <DropdownToggle  style={{backfaceVisibility:'visible' }} caret>
                                Sort By
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem >Name</DropdownItem>
                                <DropdownItem>Date</DropdownItem>
                                <DropdownItem>Size</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>    
                
                </div>
                <br/>    
                <div className='p-4'>
                    <center>
                        <Table style={{color:'white'}}  hover responsive >
                            <thead>
                                <tr>
                                <th>
                                    Sr.
                                </th>
                                <th>
                                    File Name
                                </th>
                                <th>
                                    Last Uploaded
                                </th>
                                <th>
                                    Size
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filelist}
                            </tbody>
                        </Table>
                    </center>
                </div>
            </center>
        </div>
        </div>
    );
}

export default Temp;