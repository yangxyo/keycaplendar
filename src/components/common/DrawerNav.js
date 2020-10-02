import React from "react";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { List, ListItem, ListItemGraphic } from "@rmwc/list";
import { IconButton } from "@rmwc/icon-button";
import "./DrawerNav.scss";
import logo from "../../logo.svg";

export const DesktopDrawerNav = (props) => {
  return (
    <Drawer className={"nav" + (props.open ? "" : " collapsed")} dismissible open={props.open}>
      <DrawerHeader>
        <img className="logo" src={logo} alt="logo" />
        <DrawerTitle>KeycapLendar</DrawerTitle>
        <IconButton icon="chevron_left" onClick={props.close} />
      </DrawerHeader>
      <DrawerContent>
        <List>
          <ListItem onClick={(e) => props.changePage("calendar")} activated={props.page === "calendar"}>
            <ListItemGraphic icon="calendar_today" />
            Calendar
          </ListItem>
          <ListItem onClick={(e) => props.changePage("live")} activated={props.page === "live"}>
            <ListItemGraphic icon="store" />
            Live GBs
          </ListItem>
          <ListItem onClick={(e) => props.changePage("ic")} activated={props.page === "ic"}>
            <ListItemGraphic icon="forum" />
            IC Tracker
          </ListItem>
          <ListItem onClick={(e) => props.changePage("previous")} activated={props.page === "previous"}>
            <ListItemGraphic icon="history" />
            Previous Sets
          </ListItem>
          <ListItem onClick={(e) => props.changePage("timeline")} activated={props.page === "timeline"}>
            <ListItemGraphic icon="timeline" />
            Timeline
          </ListItem>
          <ListItem onClick={(e) => props.changePage("statistics")} activated={props.page === "statistics"}>
            <ListItemGraphic icon="bar_chart" />
            Statistics
          </ListItem>
        </List>
      </DrawerContent>
      <div className="drawer-footer">
        <List className="drawer-footer-list">
          <ListItem onClick={props.openSettings}>
            <ListItemGraphic icon="settings" />
            Settings
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export const MobileDrawerNav = (props) => {
  const changePage = (newPage) => {
    props.changePage(newPage);
    props.close();
  };
  return (
    <Drawer className="nav" modal open={props.open} onClose={props.close}>
      <DrawerHeader>
        <img className="logo" src={logo} alt="logo" />
        <DrawerTitle>KeycapLendar</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <List>
          <ListItem
            onClick={(e) => {
              changePage("calendar");
            }}
            activated={props.page === "calendar"}
          >
            <ListItemGraphic icon="calendar_today" />
            Calendar
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("live");
            }}
            activated={props.page === "live"}
          >
            <ListItemGraphic icon="store" />
            Live GBs
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("ic");
            }}
            activated={props.page === "ic"}
          >
            <ListItemGraphic icon="forum" />
            IC Tracker
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("previous");
            }}
            activated={props.page === "previous"}
          >
            <ListItemGraphic icon="history" />
            Previous Sets
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("timeline");
            }}
            activated={props.page === "timeline"}
          >
            <ListItemGraphic icon="timeline" />
            Timeline
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("statistics");
            }}
            activated={props.page === "statistics"}
          >
            <ListItemGraphic icon="bar_chart" />
            Statistics
          </ListItem>
        </List>
      </DrawerContent>
      <div className="drawer-footer">
        <List className="drawer-footer-list">
          <ListItem
            onClick={() => {
              props.close();
              props.openSettings();
            }}
          >
            <ListItemGraphic icon="settings" />
            Settings
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};
export const BottomDrawerNav = (props) => {
  const changePage = (newPage) => {
    props.changePage(newPage);
    props.close();
  };
  return (
    <Drawer className="nav bottom" modal open={props.open} onClose={props.close}>
      <DrawerHeader>
        <img className="logo" src={logo} alt="logo" />
        <DrawerTitle>KeycapLendar</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <List>
          <ListItem
            onClick={(e) => {
              changePage("calendar");
            }}
            activated={props.page === "calendar"}
          >
            <ListItemGraphic icon="calendar_today" />
            Calendar
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("live");
            }}
            activated={props.page === "live"}
          >
            <ListItemGraphic icon="store" />
            Live GBs
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("ic");
            }}
            activated={props.page === "ic"}
          >
            <ListItemGraphic icon="forum" />
            IC Tracker
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("previous");
            }}
            activated={props.page === "previous"}
          >
            <ListItemGraphic icon="history" />
            Previous Sets
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("timeline");
            }}
            activated={props.page === "timeline"}
          >
            <ListItemGraphic icon="timeline" />
            Timeline
          </ListItem>
          <ListItem
            onClick={(e) => {
              changePage("statistics");
            }}
            activated={props.page === "statistics"}
          >
            <ListItemGraphic icon="bar_chart" />
            Statistics
          </ListItem>
        </List>
      </DrawerContent>
      <div className="drawer-footer">
        <List className="drawer-footer-list">
          <ListItem
            onClick={() => {
              props.close();
              props.openSettings();
            }}
          >
            <ListItemGraphic icon="settings" />
            Settings
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default DesktopDrawerNav;
