import React,{useState} from 'react';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import '../App.css';
import { Switch , Route , Redirect } from 'react-router-dom';
import Temp from './Temp';
import Login from './Login';

const Main = () => {

    const [user , setUser ] = useState(null);

    return (
        <div>
            <Header user={user} setUser={setUser} />

            <Switch>
                <Route path='/home' component={Home} />
                <Route path='/temp' component={() => <Temp user={user} />} />
                <Redirect to='/home' />
            </Switch>

            <Footer/>
        </div>
    );
}

export default Main;