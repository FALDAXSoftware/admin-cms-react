import styled from 'styled-components';
import { Col } from 'antd';

const ColWithPadding = styled(Col)`
padding:0px 10px !important;
margin-bottom:15px;
&:first-child{
    padding-left:0px !important;
}
@media only screen and (device-width: 575px),
   only screen and (max-width: 575px) {
 &{
     padding:0px !important;
 }   
}
`;

export default ColWithPadding;
