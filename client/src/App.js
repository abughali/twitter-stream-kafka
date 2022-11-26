import './App.scss';
import React from 'react';
import {Content, Theme} from '@carbon/react';
import AppHeader from './components/Header';
import {Route, Routes} from 'react-router-dom';
import LandingPage from './content/LandingPage';
import StreamingPage from './content/StreamingPage';

function App() {
    return (
        <>
            <Theme theme="g100">
                <AppHeader/>
            </Theme>
            <Content>
                <Routes>
                    <Route path="/" element={<LandingPage/>}/>
                    <Route path="/stream" element={<StreamingPage/>}/>
                </Routes>

            </Content>
        </>
    );
}

export default App;
