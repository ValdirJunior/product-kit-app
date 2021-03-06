import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";

import AuthService from "../services/auth.service";

const required = value => {
    if(!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Este campo é obrigatório!
            </div>
        )
    }
};

const email = value => {
    if (!isEmail(value)) {
      return (
        <div className="alert alert-danger" role="alert">
          Este não é um email válido.
        </div>
      );
    }
  };

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassowrd = this.onChangePassowrd.bind(this);

        this.state = {
            email: "",
            password: "",
            loading: false,
            message: "",
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }
    
    onChangePassowrd(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
        });

        this.form.validateAll();

        if(this.checkBtn.context._errors.length === 0) {
            
            AuthService.login(this.state.email, this.state.password).then(
                () => {
                    this.props.history.push("/profile");
                    window.location.reload();
                },
                error => {
                    const resMessage = 
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        loading: false,
                        message: resMessage,
                    });
                }
            );
        } else {
            this.setState({
                loading: false,
            });
        }
    }

    render() {
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-container">
                    <Form
                        onSubmit={this.handleLogin}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <Input
                                type="text"
                                className="form-control"
                                value={this.state.email}
                                onChange={this.onChangeEmail}
                                validations={[required, email]}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <Input
                                type="password"
                                className="form-control"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChangePassowrd}
                                validations={[required]}
                            />
                        </div>

                        <div className="form-group">
                            <button
                                className="btn btn-primary btn-block"
                                disabled={this.state.loading}
                            >
                                {this.state.loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                                <span>login</span>
                            </button>
                        </div>

                        {this.state.message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}