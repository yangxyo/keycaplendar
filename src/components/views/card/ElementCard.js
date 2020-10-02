import React from "react";
import Twemoji from "react-twemoji";
import LazyLoad from "react-lazy-load";
import { Typography } from "@rmwc/typography";
import { Card, CardMedia, CardPrimaryAction, CardActions, CardActionIcons, CardActionIcon } from "@rmwc/card";
import { Tooltip } from "@rmwc/tooltip";
import { Icon } from "@rmwc/icon";
import "./ElementCard.scss";

export const ElementCard = (props) => {
    const liveIndicator =
      props.live && props.page !== "live" ? (
        <Tooltip content="Live" align="bottom" enterDelay={500}>
          <Icon icon="new_releases" className="live-indicator" />
        </Tooltip>
      ) : null;
    const shipIndicator =
      props.set && props.set.shipped ? (
        <Tooltip content="Shipped" align="bottom" enterDelay={500}>
        <Icon icon="check_circle" className="ship-indicator" />
        </Tooltip>
      ) : null;
    const timeIndicator = props.thisWeek ? (
      <Typography use="overline" tag="h4" className="time-indicator">
        {props.daysLeft} day{props.daysLeft > 1 ? "s" : ""}
      </Typography>
    ) : null;
    return (
      <div className="card-container">
        <Card className={props.selected ? "mdc-card--selected" : ""}>
          <CardActions className="hover-button">
            <CardActionIcons>
              <CardActionIcon
                icon="open_in_new"
                tag="a"
                href={props.link}
                target="_blank"
                rel="noopener noreferrer"
                label={"Link to " + props.title}
              />
            </CardActionIcons>
          </CardActions>
          <CardPrimaryAction
            className={props.selected ? "mdc-card__primary-action--selected" : ""}
            onClick={() => (!props.selected ? props.details(props.set) : props.closeDetails())}
          >
            <div className="media-container">
              <LazyLoad debounce={false} offsetVertical={480} className="lazy-load">
                <CardMedia sixteenByNine style={{ backgroundImage: "url(" + props.image + ")" }} />
              </LazyLoad>
              {timeIndicator}
            </div>
            <div className="text-row">
              <div className="text-container">
                <div className="overline">
                  <Typography use="overline" tag="h3">
                    {props.designer}
                  </Typography>
                  {liveIndicator}
                  {shipIndicator}
                </div>
                <div className="title">
                  <Typography use="headline5" tag="h2">
                    <Twemoji options={{ className: "twemoji" }}>{props.title}</Twemoji>
                  </Typography>
                </div>
                <Typography use="subtitle2" tag="p">
                  {props.subtitle}
                </Typography>
              </div>
            </div>
          </CardPrimaryAction>
        </Card>
      </div>
    );
}

export default ElementCard;
