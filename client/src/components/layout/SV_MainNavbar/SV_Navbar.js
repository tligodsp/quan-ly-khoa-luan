import React from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";
import WebIcon from '@material-ui/icons/Web';
import AssignmentIcon from '@material-ui/icons/Assignment';
import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';

import NavbarNav from "./SV_NavbarNav/SV_NavbarNav";

const SV_MainNavbar = ({ layout, stickyTop }) => {
  let history = useHistory();
  const classes = classNames(
    "main-navbar",
    "bg-white",
    stickyTop && "sticky-top"
  );

  const onTinTucClick = () => {
    history.push(`/thong-bao`);
  }

  const onLogClick = () => {
    history.push(`/logtime`);
  }

  const onAdminClick = () => {
    history.push(`/ky-thuc-hien`);
  }

  return (
    <div className={classes}>
      <Container className="p-0">
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <div className="nav-bar-icon-container">
            <WebIcon className="icon-button nav-bar-icon" onClick={onTinTucClick} />
            <AssignmentIcon className="icon-button nav-bar-icon" onClick={onLogClick} />
            <OpenInBrowserIcon className="icon-button nav-bar-icon" onClick={onAdminClick} />
          </div>
          <NavbarNav />
        </Navbar>
      </Container>
    </div>
  );
};

SV_MainNavbar.propTypes = {
  /**
   * The layout type where the SV_MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

SV_MainNavbar.defaultProps = {
  stickyTop: true
};

export default SV_MainNavbar;
