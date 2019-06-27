import React, { Component } from 'react';
import generator from 'generate-password';
import { Input, Checkbox, Button, Card } from 'antd';
import SimpleReactValidator from 'simple-react-validator';

class PasswordGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            fields: {},
            numbers: false,
            symbols: false,
            uppercase: false
        }
        this.validator = new SimpleReactValidator();
    }

    _handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }

    _changeCheckbox = (field, val) => {
        this.setState({ [field]: val.target.checked })
    }

    _generatePassword = () => {
        const { numbers, symbols, uppercase, fields } = this.state;

        if (this.validator.allValid()) {
            var password = generator.generate({
                length: fields['length'],
                numbers: numbers,
                symbols: symbols,
                uppercase: uppercase
            });
            this.setState({ password }, () => {
                console.log('CALL')
                this.props.getPassword(password);
            })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    render() {
        const { password, fields, numbers, symbols, uppercase } = this.state;
        console.log('password', password)

        return (
            <React.Fragment>
                <Card title="Password Generator" style={{ width: 300 }}>
                    <div style={{ "marginBottom": "15px" }}>
                        <span>Length:</span>
                        <Input placeholder="Length" onChange={this._handleChange.bind(this, "length")} value={fields["length"]} />
                        <span style={{ "color": "red" }}>
                            {this.validator.message('length', fields["length"], 'required|numeric', 'text-danger')}
                        </span>
                    </div>
                    <Checkbox checked={numbers} onChange={this._changeCheckbox.bind(this, 'numbers')} /> <span>Numbers</span><br />
                    <Checkbox checked={symbols} onChange={this._changeCheckbox.bind(this, 'symbols')} /> <span>Symbols</span><br />
                    <Checkbox checked={uppercase} onChange={this._changeCheckbox.bind(this, 'uppercase')} /> <span>Uppercase</span><br />

                    <Button type="primary" className="user-btn" style={{ marginLeft: "0px" }} onClick={this._generatePassword} >Generate</Button><br />
                    {password.length > 0 && <span>Generated Password is <b>{password}</b></span>}
                    {password.length < 0 && <span>Password is required.</span>}
                </Card>
            </React.Fragment>
        )
    }
}

export default PasswordGenerator;
