import React, { Component } from 'react';
import generator from 'generate-password';
import { Input, Checkbox, Button } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

class PasswordGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            fields: {},
            isNumbers: false,
            isSymbols: false,
            isUppercase: false
        }
        this.validator = new SimpleReactValidator();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        if (e.target.value.trim() == "") {
            fields[field] = "";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    _changeCheckbox = (field, val) => {
        console.log('>>>>>>>>field, val', field, val)
    }

    _generatePassword = () => {
        var password = generator.generate({
            length: 20,
            numbers: true,
            symbols: true,
            uppercase: true
        });
        this.setState({ password })
    }

    render() {
        const { password, fields, isNumbers, isSymbols, isUppercase } = this.state;

        return (
            <React.Fragment>
                <span>Generated Password is {password}</span>
                <div style={{ "marginBottom": "15px" }}>
                    <span>Length:</span>
                    <Input placeholder="Length" onChange={this._handleChange.bind(this, "length")} value={fields["length"]} />
                    <span style={{ "color": "red" }}>
                        {this.validator.message('length', fields["length"], 'required|numeric', 'text-danger')}
                    </span>
                </div>
                <Checkbox checked={isNumbers} onChange={this._changeCheckbox.bind(this, 'numbers')} /> <span>Numbers</span><br />
                <Checkbox checked={isSymbols} onChange={this._changeCheckbox.bind(this, 'symbols')} /> <span>Symbols</span><br />
                <Checkbox checked={isUppercase} onChange={this._changeCheckbox.bind(this, 'uppercase')} /> <span>Uppercase</span><br />

                <Button type="primary" className="user-btn" style={{ marginLeft: "0px" }} onClick={this._generatePassword} >Generate</Button>
            </React.Fragment>
        )
    }
}

export default PasswordGenerator;
