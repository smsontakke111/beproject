import React, { useEffect, useState }  from 'react';
import { Button, Card, Table, Form, Input, InputGroup, Label , Dropdown , DropdownItem , DropdownMenu , DropdownToggle, Spinner } from 'reactstrap';
import '../App.css';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL , listAll } from "firebase/storage";
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';
import {set,  get, child , getDatabase , ref as dbref } from "firebase/database";

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
  
  const db = getDatabase(app);
  


const Temp = (props) => {

    const [isProcess,setisProcess] = useState(false);

    const [load,setLoad] = useState(false);

    const [fileNames , setfileNames] = useState([]);

    const [fnm , setFnm] = useState("");

    const [dURL,setdURL] = useState("");

    const [isStat,setisStat] = useState(0);

    const [stat , setStat ] = useState(null);

    const [compressedFile , setcompressedFile] = useState(null);

    const [userfileDetails , setuserfileDetails] = useState([]);

    const history = useHistory();

    const compressFile = (file) => {
        // var a = document.createElement("a");
        // var url = URL.createObjectURL(file);
        // a.href = url;
        // a.download = file.name;
        // document.body.appendChild(a);
        // a.click();

        var fData = new FormData();

        console.log(file);



        fData.append("file" , file);
        fData.append("filename" , file.name);

        // var b ={ 
        //     filename : file.name,
        //     file : new FormData().append('file',file)
        // }
        
        
        fetch("http://localhost:3000/compress" , { method:"POST" , body:fData })
        .then(res => res.blob())
        .then(res => {
            if (
                window.navigator && 
                window.navigator.msSaveOrOpenBlob
              ) return window.navigator.msSaveOrOpenBlob(res);
          
              // For other browsers:
              // Create a link pointing to the ObjectURL containing the blob.

              setcompressedFile(res);

              const data = window.URL.createObjectURL(res);

              

              setLoad(false);
              const link = document.createElement('a');
              link.href = data;
              link.download = "Compressed_" + file.name;
          
              // this is necessary as link.click() does not work on the latest firefox
              link.dispatchEvent(
                new MouseEvent('click', { 
                  bubbles: true, 
                  cancelable: true, 
                  view: window 
                })
              );
          
              setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
              }, 100);
        })
        .catch(err => console.log(err));

    }

    const getStat = (file) => {
        var fData = new FormData();

        console.log(file);

        fData.append("file" , file);
        fData.append("filename" , file.name);

        // var b ={ 
        //     filename : file.name,
        //     file : new FormData().append('file',file)
        // }
        
        
        fetch("http://localhost:3000/compress/stat" , { method:"POST" , body:fData })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            setStat(res);
            setisStat(2);
        })
        .catch(err => setisStat(2));
    }

    const addtoRealtimeDB = (name) => {

        if(stat)
        {
            set(dbref(db , "userfiles/" + name.split(".")[0]  ) , {
                filename : name,
                now : stat.size_output , 
                prev : stat.size_in,
                url : dURL
            } )
            .then( () => console.log("Upload Sucess !"))
            .catch(err => console.log("Upload Failure !"));
        }
        else{
            console.log("Stat Not returned !!");
        }
    } 

    const getfromRealtimeDB = (name) => {

        var refdb = dbref(getDatabase());

        get(child(refdb , "userfiles/" + name.split(".")[0] ))
            .then((snapshot) => {
                    if(snapshot.exists()){

                    var d = {
                        filename : snapshot.val().filename,
                        now : snapshot.val().now,
                        prev: snapshot.val().prev,
                        url : snapshot.val().url 
                    };

                    var dt = userfileDetails;
                    
                    var x = true;
                    for(var i=0;i<dt.length;i++){
                        if(dt[i].filename == d.filename)
                        {
                            x = false;
                            break;
                        }
                    }

                    if(x)
                    {
                        dt.push(d);
                        setuserfileDetails(dt);

                    }
                    
                }
            })
            .catch(err => console.log(err));

            
    }

    const downloadFile = (url,filename) => {

        //Swal.fire(filename);

        
        const link = document.createElement('a');
        link.href = url;
        link.download = "Compressed_" + filename;
        link.target = "_self";
    
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
        new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true 
        })
        );
    
        setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(url);

        link.remove();
        }, 100);

    }

    const Process = (e) => {
         setLoad(true);
        // setTimeout(() => {
        //     setLoad(false);
        //     setisProcess(!isProcess);
        // } , 5000);
        e.preventDefault();
        //console.log(e.target.file.files[0]);

        if(props.user)
        {
            setFnm(e.target.file.files[0].name);
            setisStat(1);
            compressFile(e.target.file.files[0]);
            getStat(e.target.file.files[0]);
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
            const uploadTask = uploadBytesResumable(storageRef, new File([compressedFile] ,uname + "$" +e.target.file.files[0].name ) , metadata);
            

            
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

            addtoRealtimeDB(e.target.file.files[0].name);

            


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

   fileNames.forEach(f => {
            if(f)
                getfromRealtimeDB(f);
        })

    console.log(fileNames);

},[fileNames]);


useEffect(() => {
    console.log(userfileDetails);

} , [userfileDetails]);




useEffect(()=>{} , [setisProcess , setLoad]);

    const filelist = userfileDetails.length == 0 ? <div><center><Spinner /></center></div> :  userfileDetails.map((f,i) => {
        
        return(
            <tr>
                <th scope="row">
                    {i+1}
                </th>
                <td>
                    {f.filename}
                </td>
                <td>
                    {((f.now/1024)/1024).toFixed(2)} MB
                </td>
                <td>
                    {((f.prev/1024)/1024).toFixed(2)} MB
                </td>
                <td>
                    { (((((f.now/1024)/1024).toFixed(2))/(((f.prev/1024)/1024).toFixed(2)))*100).toFixed(2) } % 
                </td>
                <td>
                    <Button onClick={() => downloadFile(f.url,f.filename)}><i className="fa fa-download fa-lg"></i></Button>
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
                            <Button className='m-2 rounded col-3' color='danger' type="submit"  disabled={isStat == 1 ? true : false} >{isStat == 1 ? "Compressing..." : "Compress"}</Button>
                            {/* <a href={dURL} target="_blank" style={{textDecoration:"none"}}><Button type="button" className='m-2 rounded col-3' color='danger' style={ isProcess ? {display:'block'} : {display : 'none'}} >Download</Button></a> */}
                            <br/><br/>
                                
                            <i style={ load ? { display:'block',  color:'white' , fontSize: '20px' } : { display:'none',  color:'white' , fontSize: '20px' }}>File will get downloaded soon.....</i>
                        
                        
                            
                            
                        
                    </Form>
                </div>
                {/* {
                    img ? (
                        <div className="container p-4">
                            <img src={ URL.createObjectURL(img)} className="img-fluid" alt="Compressed image" />
                        </div>
                    ):(
                        <div></div>
                    ) */}

                

                {/* <div className='container p-4'>
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
                <br/>   */} 
                 

{
    isStat == 0 ? (
        <div></div>
    ) : (
        isStat == 1 ? (
            <Spinner  style={{color:"white"}} />
        ) : (
            <div className="p-4 border shadow-lg background2" >
                    <center>
                        <h3>File : {fnm}</h3>
                        <br/>
                        <Table hover responsive style={{color:"white"}}>
                            <thead>
                                <tr>
                                    
                                    <th>
                                    <center>
                                        Original Size
                                    </center>
                                    </th>
                                    <th>
                                    <center> Compressed Size</center>
                                    </th>
                                    <th>
                                    <center>Compression Rate</center>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr>
                                    
                                    <td>
                                    <center>
                                    { stat ? ((stat.size_in/1024)/1024).toFixed(2) : "-"  }  MB
                                    </center>
                                    </td>
                                    <td>
                                    <center> { stat ? ((stat.size_output/1024)/1024).toFixed(2) : "-"} MB</center>
                                    </td>
                                    <td>
                                    <center> {stat ? stat.percent + " %" : "-"}</center>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </center>
                </div>
        )
    ) 
}
                
                <br/><br/>

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
                                    Compressed Size
                                </th>
                                <th>
                                    Actual Size
                                </th>
                                <th>
                                    Compress Ratio
                                </th>
                                <th>
                                    Download
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