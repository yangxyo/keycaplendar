import React from "react";
import Twemoji from "react-twemoji";
import LazyLoad from "react-lazy-load";
import { ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemMeta } from "@rmwc/list";
import { IconButton } from "@rmwc/icon-button";
import { Typography } from "@rmwc/typography";
import { Tooltip } from "@rmwc/tooltip";
import "./ElementList.scss";

export const ElementList = (props) => {
  const liveIndicator =
    props.live && props.page !== "live" ? (
      <Tooltip content="Live" align="bottom" enterDelay={500}>
        <ListItemMeta
          className="live-indicator"
          icon="new_releases"
        />
      </Tooltip>
    ) : null;
  const shipIndicator =
    props.set && props.set.shipped ? (
      <Tooltip content="Shipped" align="bottom" enterDelay={500}>
        <ListItemMeta
          className="ship-indicator"
          icon="check_circle"
        />
      </Tooltip>
    ) : null;
  const timeIndicator = props.thisWeek ? (
    <Typography use="overline" className="time-indicator">
      {props.daysLeft} day{props.daysLeft > 1 ? "s" : ""}
    </Typography>
  ) : (
    ""
  );
  return (
    <ListItem
      selected={props.selected}
      onClick={() => (!props.selected ? props.details(props.set) : props.closeDetails())}
    >
      <LazyLoad debounce={false} offsetVertical={480} className="list-image-container">
        <div className="list-image" style={{ backgroundImage: "url(" + props.image + ")" }}></div>
      </LazyLoad>
      <ListItemText>
        <Typography use="overline" className="overline">
          {props.set.designer.join(" + ")}
        </Typography>
        <ListItemPrimaryText>
          <Twemoji options={{ className: "twemoji" }}>{props.title}</Twemoji>
        </ListItemPrimaryText>
        <ListItemSecondaryText>{props.subtitle}</ListItemSecondaryText>
      </ListItemText>
      {timeIndicator}
      {liveIndicator}
      {shipIndicator}
      <div className="link-icon">
        <IconButton tag="a" href={props.link} target="_blank" rel="noopener noreferrer" icon="open_in_new" />
      </div>
    </ListItem>
  );
};

export default ElementList;
