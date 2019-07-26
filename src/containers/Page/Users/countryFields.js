import React, { Component } from 'react';
import 'antd/dist/antd.css';
import styled from 'styled-components';
import { Select, Row, Col } from 'antd';
import CountryData from 'country-state-city';

const Option = Select.Option;

const Country = styled.span`
    font-size: 14.007px;
    color: "rgba( 80, 80, 80, 0.502 )";
    -moz-transform: matrix( 0.99999985149599,0,0,0.99949238260564,0,0);
    -webkit-transform: matrix( 0.99999985149599,0,0,0.99949238260564,0,0);
    -ms-transform: matrix( 0.99999985149599,0,0,0.99949238260564,0,0);
    display:block;
`
const SelectS = styled(Select)`
    width:85% !important;
    & .Country_Select
    {
        width:75%;
    }
    & .Country_Select:first-child
    {
        margin-left:0px !important;
    }
    & .Country_Select > .ant-select-selection
    {
        background-color: #f8f8f8;
        width: 100%;
        border: 1px solid #dadfe3;
        padding: 5px;
        height: auto;
        font-family: "Open Sans";
        font-size:16;
        font-weight:600;
    }
    & .Country_Select > .ant-select-selection:hover,.Country_Select > .ant-select-selection:focus{
        border-color:#4c84ff;
        outline:0;
        box-shadow:none;
    }
    @media(max-width:991px)
    {
        width:93%;
    }
    @media(max-width:767px)
    {
        margin-top:0px;
        width:100%;
    }
`
const SelectWrap = styled.div`
    @media(max-width:767px)
    {
        margin-top:25px;
    }
`
const CountryWrap = styled.div`
    margin-top:15px;
    @media(max-width:991px)
    {
        margin-right:20px;
    }
    @media(max-width:767px)
    {
        margin-right:0px;
    }
`

export default class CountryFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            countries: [],
            selectedCountry: this.props.countryName,
            selectedState: null,
            selectedCity: null,
            countryID: "",
            stateID: "",
            states: [],
            cities: []
        }
        this._changeCountry = this._changeCountry.bind(this);
        this._changeState = this._changeState.bind(this);
        this._changeCity = this._changeCity.bind(this);
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            selectedCountry: nextProps.countryName, selectedState: nextProps.stateName,
            selectedCity: nextProps.cityName
        })
    }

    _changeCountry = (value, position) => {
        this.state.countries.filter((country) => {
            if (country.name == value) {
                this.setState({ changedCountry: country }, () => {
                    var newPosition = Number(position.key) - 1;
                    var states = CountryData.getStatesOfCountry(newPosition + 1);
                    this.setState({
                        selectedCountry: country.name, countryID: newPosition, states,
                        countryCode: country.sortname
                    });
                    this.props.onCountryChange(country.name, null, null, null, null, country.sortname);
                })
            }
        })
    }

    _changeState = (value, position) => {
        var cities = CountryData.getCitiesOfState(position.key);
        var stateID = position.key;
        const { selectedCountry, countryID, countryCode } = this.state;

        this.setState({ selectedState: value, selectedCity: "", stateID: position.key, cities });
        this.props.onCountryChange(selectedCountry, value, null, stateID, countryID, countryCode);
    }

    _changeCity = (value, position) => {
        const { selectedCountry, selectedState, countryID, stateID, countryCode } = this.state;
        this.setState({ selectedCity: value });
        this.props.onCountryChange(selectedCountry, selectedState, value, stateID, countryID, countryCode);
    }

    _handleBlur = () => {

    }

    componentDidMount() {
        let allCountries = CountryData.getAllCountries();
        this.setState({ countries: allCountries });
    }

    render() {
        const { selectedCountry, selectedState, selectedCity, states, cities, countries } = this.state;

        return (
            <CountryWrap>
                <Row>
                    <Col sm={24} md={8} xl={8} xxl={8} style={{ zIndex: "1" }}>
                        <Country>Country:</Country>
                        <SelectS
                            showSearch
                            value={selectedCountry}
                            placeholder="Select a Country"
                            dropdownClassName="country_select_drop"
                            optionFilterProp="children"
                            onChange={this._changeCountry}
                            onBlur={this._handleBlur}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {countries.map((country, index) => <Option key={country.id} value={country.name}>{country.name}</Option>)}
                        </SelectS>
                    </Col>
                    <Col sm={24} md={8} xl={8} xxl={8} style={{ zIndex: "1" }}>
                        <SelectWrap>
                            <Country>State:</Country>
                            <SelectS
                                showSearch
                                value={selectedState}
                                placeholder="Select a State"
                                dropdownClassName="country_select_drop"
                                optionFilterProp="children"
                                onChange={this._changeState}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {states.map((state, index) => <Option key={state.id} value={state.name}>{state.name}</Option>)}
                            </SelectS>
                        </SelectWrap>
                    </Col>
                    <Col sm={24} md={8} xl={8} xxl={8} style={{ zIndex: "1" }}>
                        <SelectWrap>
                            <Country>City:</Country>
                            <SelectS
                                showSearch
                                value={selectedCity}
                                placeholder="Select a City"
                                dropdownClassName="country_select_drop"
                                optionFilterProp="children"
                                onChange={this._changeCity}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {cities !== null ? cities.map((city, index) => <Option key={city.id} value={city.name}>{city.name}</Option>) : ''}
                            </SelectS>
                        </SelectWrap>
                    </Col>
                </Row>
            </CountryWrap>
        );
    }
}
