import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import BigSearchBox from "../components/BigSearchBox.js";


const styleContainer = {
  width: '100%',
  padding: '0',
  height: '52px',
}

const styleNav = {
  backgroundColor: 'white',
}


class Header extends Component {

    render() {
        return (
            <div className= "container" style={styleContainer}>
              <Navbar fluid collapseOnSelect style={styleNav}>
                <Navbar.Header>
                  <Navbar.Brand>
                  <Link to= "/app/home">Sapie Space</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  {this.props.isAuthenticated
                    ? <Navbar.Text  key={1}>
                        <Link to="/app/settings"><font color="#66b2b2">Settings</font></Link>
                      </Navbar.Text>
                    : [
                        <Navbar.Text key={1}>

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
