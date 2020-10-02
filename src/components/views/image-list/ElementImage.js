import React from "react";
import Twemoji from "react-twemoji";
import LazyLoad from "react-lazy-load";
import {
  ImageListItem,
  ImageListImageAspectContainer,
  ImageListImage,
  ImageListSupporting,
  ImageListLabel,
} from "@rmwc/image-list";
import { IconButton } from "@rmwc/icon-button";
import { Ripple } from "@rmwc/ripple";
import { Typography } from "@rmwc/typography";
import { Tooltip } from "@rmwc/tooltip";
import { Icon } from "@rmwc/icon";
import "./ElementImage.scss";

export const ElementImage = (props) => {
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
    <div className="time-indicator">
      <Typography use="overline" className="live-indicator-text">
        {props.daysLeft} day{props.daysLeft > 1 ? "s" : ""}
      </Typography>
    </div>
  ) : null;
  return (
    <Ripple>
      <ImageListItem
        onClick={() => (!props.selected ? props.details(props.set) : props.closeDetails())}
        key={props.image}
        className={"image-list-item" + (props.selected ? " selected" : "")}
      >
        <div className="container">
          <div className="link-icon-container">
            <IconButton
              className="link-icon"
              icon="open_in_new"
              tag="a"
              href={props.link}
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
          <div className="media-container">
            {timeIndicator}
            <ImageListImageAspectContainer style={{ paddingBottom: "calc(100% / 1)" }}>
              <LazyLoad debounce={false} offsetVertical={480}>
                <ImageListImage tag="div" style={{ backgroundImage: "url(" + props.image + ")" }} />
              </LazyLoad>
            </ImageListImageAspectContainer>
          </div>
          <ImageListSupporting>
            <ImageListLabel>
              <div className="text-container">
                <div className="primary-text">
                  <Twemoji options={{ className: "twemoji" }}>{props.title}</Twemoji>
                </div>
                <div className="secondary-text">{props.subtitle}</div>
              </div>
              {liveIndicator}
              {shipIndicator}
            </ImageListLabel>
          </ImageListSupporting>
        </div>
      </ImageListItem>
    </Ripple>
  );
};

export default ElementImage;
