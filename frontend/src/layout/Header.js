import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link, Route} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

class Header extends Component {

    render() {
        return (
            <div className= "container">
              <Navbar fluid collapseOnSelect >
                <Navbar.Header>
                  <Navbar.Brand>
                  <Link to= "/app/home">Sapie Space</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  {this.props.isAuthenticated
                    ? <Navbar.Text  key={1}>
                        Signed in as: <Link to="/app/profile">{this.props.user}</Link>
                      </Navbar.Text>
                    : [
                        <Navbar.Text key={1}>
                         Welcome!
                       </Navbar.Text>
                    ]}
                  <Nav pullRight>
                    {this.props.isAuthenticated
                      ? <NavItem onClick={this.props.handleLogout}>Logout</NavItem>
                      : [
                            <LinkContainer key={2} to= "/app/signup"
                             activeClassName="activeLink"
                             activeStyle={{
                               fontWeight: 'bold'
                            }}>
                              <NavItem>
                              Signup
                              </NavItem>
                            </LinkContainer>,
                            <LinkContainer key={3} to= "/app/login"
                             activeClassName="activeLink"
                             activeStyle={{
                               fontWeight: 'bold'
                            }}>
                              <NavItem>
                              Login
                              </NavItem>
                            </LinkContainer>
                        ]}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
        );
    }
}
export default Header;
