import React, { Component } from 'react';
import { Spin } from 'antd';
import Loader from '../../image/light-loader.gif'
import styled from 'styled-components';

const antIcon = <img className="faldax-loader" src={Loader} alt="loading..." />

const Overlay = styled.div`
    width: ${props => props.isSignUpPage ? "calc(100% - 500px)" : "100%"};
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const MainOverlay = styled.div`
    width: 100%;
    height: 100vh;
    background-color: rgb(0,0,0,0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
`;

class FaldaxLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() { 
        console.log(this.props)
        return (
            <MainOverlay> 
                <Overlay {...this.props}>
                    <Spin indicator={antIcon} />
                </Overlay>
            </MainOverlay>
        );
    }
}

export default FaldaxLoader;
