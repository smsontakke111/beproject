import React from 'react';

const Footer = () => {

    return (
        <div className='row p-3' style={{backgroundColor: 'rgb(107, 15, 117)' }}>
                <div className='col-lg-1 col-6 col-sm-3 offset-lg-4'>
                    <center>
                    <a className=' nav-link ' id='social' target='_blank' href='https://github.com/smsontakke111'  >GITHUB</a>
                    </center>
                </div>
                <div className='col-lg-1 col-6 col-sm-3'>
                    <center>
                <a className=' nav-link ' id='social' target='_blank' href='https://linkedin.com/in/sushant-sontakke'  >LINKEDIN</a>
                </center>
                </div>
                <div className='col-lg-1 col-6 col-sm-3'>
                <center>
                <a className=' nav-link ' id='social' target='_blank' href='https://www.instagram.com/sushant_sontakke_11/' >INSTAGRAM</a>
                </center>
                </div>
                <div className='col-lg-1 col-6 col-sm-3'>
                <center>
                <a className=' nav-link ' id='social' target='_blank' href='https://twitter.com/sushant28382346' >TWITTER</a>
                </center>
                </div>
                
        </div>
    );
}

export default Footer;