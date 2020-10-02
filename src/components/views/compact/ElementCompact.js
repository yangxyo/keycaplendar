import React from "react";
import Twemoji from "react-twemoji";
import { ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemGraphic } from "@rmwc/list";
import { IconButton } from "@rmwc/icon-button";
import { Tooltip } from "@rmwc/tooltip";
import "./ElementCompact.scss";

export const ElementCompact = (props) => {
  const liveIndicator =
    props.live && props.page !== "live" ? (
      <Tooltip content="Live" align="bottom" enterDelay={500}>
        <ListItemGraphic
          className="live-indicator"
          icon="new_releases"
        />
      </Tooltip>
    ) : null;
  const shipIndicator =
    props.set && props.set.shipped ? (
      <Tooltip content="Shipped" align="bottom" enterDelay={500}>
        <ListItemGraphic
          className="ship-indicator"
          icon="check_circle"
        />
      </Tooltip>
    ) : null;
  return (
    <ListItem
      selected={props.selected}
      onClick={() => (!props.selected ? props.details(props.set) : props.closeDetails())}
    >
      {liveIndicator}
      {shipIndicator}
      <ListItemText>
        <ListItemPrimaryText>
          <Twemoji options={{ className: "twemoji" }}>{props.title}</Twemoji>
        </ListItemPrimaryText>
        <ListItemSecondaryText>{props.subtitle}</ListItemSecondaryText>
      </ListItemText>
      <IconButton
        tag="a"
        className="link"
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        icon="open_in_new"
      ></IconButton>
    </ListItem>
  );
};

export default ElementCompact;
