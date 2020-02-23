import React from 'react';
import { TopAppBar, TopAppBarRow, TopAppBarSection, TopAppBarNavigationIcon, TopAppBarTitle, TopAppBarActionItem, TopAppBarFixedAdjust } from '@rmwc/top-app-bar';
import { Tooltip } from '@rmwc/tooltip';
import { Ripple } from '@rmwc/ripple';
import './AppBar.scss';
import logo from '../logo.svg';

export class DesktopAppBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDrawerIcon = this.toggleDrawerIcon.bind(this);
    }

    toggleDrawerIcon() {
        this.props.toggleDrawer();
    }
    render() {
        return (
            <div>
                <TopAppBar fixed>
                    <TopAppBarRow>
                        <TopAppBarSection alignStart>
                            <TopAppBarNavigationIcon icon="menu" onClick={this.toggleDrawerIcon} />
                            <img className="logo" src={logo} alt="logo" />
                            <TopAppBarTitle>KeycapLendar</TopAppBarTitle>
                        </TopAppBarSection>
                        <TopAppBarSection alignEnd>
                            <Tooltip content="Sort" align="bottom"><TopAppBarActionItem icon="sort" /></Tooltip>
                            <Tooltip content="Filter" align="bottom"><TopAppBarActionItem icon="filter_list" /></Tooltip>
                            <Tooltip content="View" align="bottom">
                                <Ripple unbounded>
                                    <div className="svg-container mdc-icon-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20 3H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 6H4V5h15v4zm1 4H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-1 6H4v-4h15v4z" /><path d="M4 15h15v4H4zM4 5h15v4H4z" opacity=".3" /></svg>
                                    </div>
                                </Ripple>
                            </Tooltip>
                        </TopAppBarSection>
                    </TopAppBarRow>
                </TopAppBar>
                <TopAppBarFixedAdjust />
            </div>
        );
    }
};

export class TabletAppBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDrawerIcon = this.toggleDrawerIcon.bind(this);
    }

    toggleDrawerIcon() {
        this.props.toggleDrawer();
    }
    render() {
        return (
            <div>
                <TopAppBar fixed>
                    <TopAppBarRow>
                        <TopAppBarSection alignStart>
                            <TopAppBarNavigationIcon icon="menu" onClick={this.toggleDrawerIcon} />
                            <TopAppBarTitle>{this.props.view}</TopAppBarTitle>
                        </TopAppBarSection>
                        <TopAppBarSection alignEnd>
                            <Tooltip content="Sort" align="bottom"><TopAppBarActionItem icon="sort" /></Tooltip>
                            <Tooltip content="Filter" align="bottom"><TopAppBarActionItem icon="filter_list" /></Tooltip>
                            <Tooltip content="View" align="bottom">
                                <Ripple unbounded>
                                    <div className="svg-container mdc-icon-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20 3H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 6H4V5h15v4zm1 4H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-1 6H4v-4h15v4z" /><path d="M4 15h15v4H4zM4 5h15v4H4z" opacity=".3" /></svg>
                                    </div>
                                </Ripple>
                            </Tooltip>
                        </TopAppBarSection>
                    </TopAppBarRow>
                </TopAppBar>
                <TopAppBarFixedAdjust />
            </div>
        );
    }
};

export class MobileAppBar extends React.Component {
    constructor(props) {
        super(props);

        this.toggleDrawerIcon = this.toggleDrawerIcon.bind(this);
    }
    toggleDrawerIcon() {
        this.props.toggleDrawer();
    }
    scrollTop() {
        window.scrollTo(0,0);
    }
    render() {
        return (
            <div>
                <TopAppBar short>
                    <TopAppBarRow>
                        <TopAppBarSection alignStart className="nav-icon">
                            <TopAppBarNavigationIcon icon="menu" onClick={this.toggleDrawerIcon} />
                            <TopAppBarTitle>{this.props.view}</TopAppBarTitle>
                        </TopAppBarSection>
                        <TopAppBarSection alignEnd className="actions">
                            <Tooltip content="Sort" align="bottom"><TopAppBarActionItem icon="sort" /></Tooltip>
                            <Tooltip content="Filter" align="bottom"><TopAppBarActionItem icon="filter_list" /></Tooltip>
                            <Tooltip content="View" align="bottom">
                                <Ripple unbounded>
                                    <div className="svg-container mdc-icon-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20 3H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zm-1 6H4V5h15v4zm1 4H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm-1 6H4v-4h15v4z" /><path d="M4 15h15v4H4zM4 5h15v4H4z" opacity=".3" /></svg>
                                    </div>
                                </Ripple>
                            </Tooltip>
                        </TopAppBarSection>
                        <TopAppBarSection alignEnd className="short-logo" onClick={this.scrollTop}>
                            <img className="logo" src={logo} alt="logo" />
                        </TopAppBarSection>
                    </TopAppBarRow>
                </TopAppBar>
                <TopAppBarFixedAdjust />
            </div>
        );
    }
};

export default DesktopAppBar;