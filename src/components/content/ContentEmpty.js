import React from "react";
import emptyImg from "../../empty.svg";
import { Typography } from "@rmwc/typography";
import { Button } from "@rmwc/button";
import "./ContentEmpty.scss";

export const ContentEmpty = () => {
  return (
    <div className="empty-container">
      <img className="image" src={emptyImg} alt="Empty" />
      <Typography className="title" use="headline6" tag="h3">
        Nothing to see here
      </Typography>
      <Typography className="subtitle" use="body1" tag="p">
        No results, please adjust your filters/search.
      </Typography>
    </div>
  );
};
export const ContentFailed = (props) => {
  return (
    <div className="empty-container">
      <img className="image" src={emptyImg} alt="Empty" />
      <Typography className="title" use="headline6" tag="h3">
        Nothing to see here
      </Typography>
      <Typography className="subtitle" use="body1" tag="p">
        Looks like something went wrong, use the button below to retry.
      </Typography>
      <Button label="Retry" onClick={props.getData} raised />
    </div>
  );
};

export default ContentEmpty;
