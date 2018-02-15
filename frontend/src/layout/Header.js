import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import RouteNavItem from "../components/RouteNavItem";


class Header extends Component {

    render() {
        return (
            <div className= "container">
              <Navbar fluid collapseOnSelect >
                <Navbar.Header>
                  <Navbar.Brand>
                    <a href= "/app/home">Sapie Space</a>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  {this.props.isAuthenticated
                    ? <Navbar.Text>
                        Signed in as: <Navbar.Link href="app/profile">{this.props.user}</Navbar.Link>
                      </Navbar.Text>
                    : [
                        <Navbar.Text>
                          Welcome!
                        </Navbar.Text>
                      ]}
                  <Nav pullRight>
                    {this.props.isAuthenticated
                      ? <NavItem onClick={this.props.handleLogout}>Logout</NavItem>
                      : [
                          <RouteNavItem key={1} href="/app/signup">
                            Signup
                          </RouteNavItem>,
                          <RouteNavItem key={2} href="/app/login">
                            Login
                          </RouteNavItem>
                        ]}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
        );
    }
}
export default Header;
