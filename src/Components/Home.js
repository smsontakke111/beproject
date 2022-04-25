import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Form, Input, InputGroup, Label } from 'reactstrap';

const Home = () => {

    const [isProcess,setisProcess] = useState(false);

    const [load,setLoad] = useState(false);

    const Process = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
            setisProcess(!isProcess);
        } , 5000);
        
        
    }

    useEffect(()=>{} , [setisProcess , setLoad]);
    return (
        <div className='row'>
            <div className='col-12 p-5 background' >
            <center>
                <h1 style={{color: 'white'}}>Easily Compress Files in Seconds !</h1>
                <br/>
                <br/>

                <div className='container p-2 ' >
                    <Form >
                            <Input className='m-2'  type='file' style={{width:'320px'}} />
                                
                                <br/><br/>
                            <Button className='m-2 rounded col-3' color='danger' style={ isProcess ? {display:'none'} : {display : 'block'}} onClick={Process} >Compress</Button>
                            <Button className='m-2 rounded col-3' color='danger' style={ isProcess ? {display:'block'} : {display : 'none'}} >Download</Button>
                            <br/><br/>

                                <div class="spinner-border" role="status" style={ load ? { display:'block',  color:'white' , fontSize: '50%' } : { display:'none',  color:'white' , fontSize: '50%' }}>
                                    <span class="sr-only">Loading...</span>
                                </div>
                        
                        {/* <div className='col-12 p-3'>
                        <Button className='m-2 rounded col-3' color ='danger'>Download</Button>

                        </div> */}
                            
                            
                        
                    </Form>
                </div>

                        <br/><br/><br/>
                        <h1 style={{color: 'white'}}>How to Compress :</h1>
                        <br/><br/>
                <div className='row' style={{color: 'white'}}>
                        <div className='col-12 col-lg-4 p-1' >
                            <Card style={{backgroundColor: 'rgb(20,20,20)'}}>
                                <CardBody>
                                    Instruction 1
                                </CardBody>
                            </Card>
                        </div>
                        <div className='col-12 col-lg-4 p-1'>
                        <Card style={{backgroundColor: 'rgb(20,20,20)'}}>
                                <CardBody>
                                    Instruction 2
                                </CardBody>
                            </Card>
                        </div>
                        <div className='col-12 col-lg-4 p-1'>
                        <Card style={{backgroundColor: 'rgb(20,20,20)'}}>
                                <CardBody>
                                    Instruction 3
                                </CardBody>
                            </Card>
                        </div>
                        
                </div>
            
            </center>
            
            </div>
        </div>
    );
}

export default Home;