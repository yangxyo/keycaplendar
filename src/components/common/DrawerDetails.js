import React from "react";
import Twemoji from "react-twemoji";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { IconButton } from "@rmwc/icon-button";
import { Chip, ChipSet } from "@rmwc/chip";
import { Tooltip } from "@rmwc/tooltip";
import { Button } from "@rmwc/button";
import { List, ListItem, ListItemText, ListItemPrimaryText, ListItemSecondaryText, ListItemMeta } from "@rmwc/list";
import { Typography } from "@rmwc/typography";
import "./DrawerDetails.scss";

export class DesktopDrawerDetails extends React.Component {
  setScroll() {
    const chipSet = document.getElementById("chip-set");
    if (document.querySelector(".mdc-chip-set .mdc-chip--selected")) {
      const selectedChip = document.querySelector(".mdc-chip-set .mdc-chip--selected");
      chipSet.scrollLeft = selectedChip.offsetLeft - 24;
    } else {
      chipSet.scrollLeft = 0;
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.search !== prevProps.search || this.props.set !== prevProps.set) {
      this.setScroll();
    }
    if (this.props.set !== prevProps.set) {
      document.querySelector(".details-drawer .mdc-drawer__content").scrollTop = 0;
    }
  }
  render() {
    let set = this.props.set;
    if (!set.image) {
      set.image = "";
    }
    const today = new Date();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    let gbLaunch;
    let gbEnd;
    let icDate;
    let verb;
    let ic;
    let gb;
    let vendorList;
    let shippedLine;
    const sortedVendors =
      set.vendors && set.vendors[0]
        ? set.vendors.sort((a, b) => {
            var regionA = a.region.toLowerCase();
            var regionB = b.region.toLowerCase();
            if (regionA < regionB) {
              return -1;
            }
            if (regionA > regionB) {
              return 1;
            }
            return 0;
          })
        : [];
    let chips = [];
    const chipsContent = ["profile", "colorway", "designer", "vendors"];
    if (set.icDate) {
      gbLaunch = set.gbLaunch.includes("Q") ? set.gbLaunch : new Date(set.gbLaunch);
      gbEnd = new Date(set.gbEnd);
      icDate = new Date(set.icDate);
      ic =
        "IC posted " +
        icDate.getUTCDate() +
        nth(icDate.getUTCDate()) +
        "\xa0" +
        month[icDate.getUTCMonth()] +
        (icDate.getUTCFullYear() !== today.getUTCFullYear() ? " " + icDate.getUTCFullYear() : "") +
        ".";
      if (gbLaunch <= today && gbEnd >= today) {
        verb = "Running";
      } else if (gbEnd <= today) {
        verb = "Ran";
      } else if (gbLaunch > today) {
        verb = "Will run";
      } else {
        verb = "Runs";
      }
      if (set.gbLaunch !== "" && set.gbEnd) {
        gb =
          verb +
          " from " +
          gbLaunch.getUTCDate() +
          nth(gbLaunch.getUTCDate()) +
          "\xa0" +
          month[gbLaunch.getUTCMonth()] +
          (gbLaunch.getUTCFullYear() !== today.getUTCFullYear() && gbLaunch.getUTCFullYear() !== gbEnd.getUTCFullYear()
            ? " " + gbLaunch.getUTCFullYear()
            : "") +
          " until " +
          gbEnd.getUTCDate() +
          nth(gbEnd.getUTCDate()) +
          "\xa0" +
          month[gbEnd.getUTCMonth()] +
          (gbEnd.getUTCFullYear() !== today.getUTCFullYear() ? " " + gbEnd.getUTCFullYear() : "") +
          ".";
      } else if (set.gbLaunch.includes("Q")) {
        gb = "GB expected " + gbLaunch + ".";
      } else if (set.gbMonth && set.gbLaunch !== "") {
        gb = "Expected " + month[gbLaunch.getUTCMonth()] + ".";
      } else if (set.gbLaunch !== "") {
        gb =
          verb +
          " from " +
          gbLaunch.getUTCDate() +
          nth(gbLaunch.getUTCDate()) +
          "\xa0" +
          month[gbLaunch.getUTCMonth()] +
          (gbLaunch.getUTCFullYear() !== today.getUTCFullYear() && gbLaunch.getUTCFullYear() !== gbEnd.getUTCFullYear()
            ? " " + gbLaunch.getUTCFullYear()
            : "") +
          ".";
      } else {
        gb = false;
      }
      chipsContent.forEach((prop) => {
        if (prop === "vendors") {
          sortedVendors.forEach((vendor) => {
            chips.push(vendor.name);
          });
        } else {
          if (!Array.isArray(set[prop])) {
            chips.push(set[prop]);
          } else {
            set[prop].forEach((entry) => {
              chips.push(entry);
            });
          }
        }
      });
      shippedLine =
        gbEnd <= today ? (
          this.props.set.shipped ? (
            <Typography use="body2" tag="p">
              This set has shipped.
            </Typography>
          ) : (
            <Typography use="body2" tag="p">
              This set has not shipped.
            </Typography>
          )
        ) : (
          ""
        );
    }
    const gbLine = gb ? (
      <Typography use="body2" tag="p">
        {gb}
      </Typography>
    ) : (
      ""
    );
    if (set.vendors) {
      vendorList = (
        <div className="details-list">
          <Typography className="subheader" use="caption" tag="h4">
            Vendors
          </Typography>
          <List twoLine>
            {sortedVendors.map((vendor, index) => {
              if (vendor.storeLink !== "") {
                return (
                  <ListItem key={index} tag="a" href={vendor.storeLink} target="_blank" rel="noopener noreferrer">
                    <ListItemText>
                      <ListItemPrimaryText>{vendor.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>{vendor.region}</ListItemSecondaryText>
                    </ListItemText>
                    <ListItemMeta icon="launch" />
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={index} disabled>
                    <ListItemText>
                      <ListItemPrimaryText>{vendor.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>{vendor.region}</ListItemSecondaryText>
                    </ListItemText>
                  </ListItem>
                );
              }
            })}
          </List>
        </div>
      );
    }
    const editorButtons =
      this.props.user.isEditor ||
      (this.props.user.isDesigner && set.designer && set.designer.indexOf(this.props.user.nickname) > -1) ? (
        <div className="editor-buttons">
          <Button className="edit" outlined label="Edit" onClick={() => this.props.edit(set)} icon="edit" />
          {this.props.user.isEditor ? (
            <Button
              className="delete"
              outlined
              danger
              label="Delete"
              onClick={() => this.props.delete(this.props.set)}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      );
    const lichButton =
      this.props.set.colorway === "Lich" ? <IconButton icon="palette" onClick={this.props.toggleLichTheme} /> : null;
    return (
      <Drawer dismissible open={this.props.open} className="details-drawer drawer-right">
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
          {lichButton}
          <Tooltip enterDelay={500} content="Close" align="bottom">
            <IconButton className="close-icon" icon="close" onClick={this.props.close} />
          </Tooltip>
        </DrawerHeader>
        <DrawerContent>
          <div>
            <div
              className="details-image"
              style={{ backgroundImage: "url(" + set.image.replace("keysets", "card") + ")" }}
            ></div>
            <div className="details-text">
              <Typography use="overline" tag="h3">
                Designed by {set.designer ? set.designer.toString().replace(/,/g, " + ") : ""}
              </Typography>
              <Typography use="headline4" tag="h1">
                <Twemoji options={{ className: "twemoji" }}>
                  {(set.profile ? set.profile : "") + " " + (set.colorway ? set.colorway : "")}
                </Twemoji>
              </Typography>
              {gbLine}
              {shippedLine}
              <Typography use="body2" tag="p">
                {ic}
              </Typography>
            </div>
            <div className="details-button">
              <Button outlined label="Link" tag="a" href={set.details} target="_blank" rel="noopener noreferrer" />
            </div>
            {vendorList}
          </div>
        </DrawerContent>
        {editorButtons}
        <div className="search-chips-container">
          <div className="search-chips">
            <ChipSet id="chip-set" choice>
              {chips.map((value, index) => {
                return (
                  <Chip
                    icon="search"
                    label={value}
                    key={value.toLowerCase() + index}
                    selected={this.props.search.toLowerCase() === value.toLowerCase()}
                    onClick={() => this.props.setSearch(value)}
                  />
                );
              })}
            </ChipSet>
          </div>
        </div>
      </Drawer>
    );
  }
}

export class TabletDrawerDetails extends React.Component {
  render() {
    let set = this.props.set;
    if (!set.image) {
      set.image = "";
    }
    const today = new Date();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const nth = function (d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    let gbLaunch;
    let gbEnd;
    let icDate;
    let verb;
    let ic;
    let gb;
    let vendorList;
    let shippedLine;
    const sortedVendors =
      set.vendors && set.vendors[0]
        ? set.vendors.sort((a, b) => {
            var regionA = a.region.toLowerCase();
            var regionB = b.region.toLowerCase();
            if (regionA < regionB) {
              return -1;
            }
            if (regionA > regionB) {
              return 1;
            }
            return 0;
          })
        : [];
    let chips = [];
    const chipsContent = ["profile", "colorway", "designer", "vendors"];
    if (set.icDate) {
      gbLaunch = set.gbLaunch.includes("Q") ? set.gbLaunch : new Date(set.gbLaunch);
      gbEnd = new Date(set.gbEnd);
      icDate = new Date(set.icDate);
      ic =
        "IC posted " +
        icDate.getUTCDate() +
        nth(icDate.getUTCDate()) +
        "\xa0" +
        month[icDate.getUTCMonth()] +
        (icDate.getUTCFullYear() !== today.getUTCFullYear() ? " " + icDate.getUTCFullYear() : "") +
        ".";
      if (gbLaunch <= today && gbEnd >= today) {
        verb = "Running";
      } else if (gbEnd <= today) {
        verb = "Ran";
      } else if (gbLaunch > today) {
        verb = "Will run";
      } else {
        verb = "Runs";
      }
      if (set.gbLaunch !== "" && set.gbEnd) {
        gb =
          verb +
          " from " +
          gbLaunch.getUTCDate() +
          nth(gbLaunch.getUTCDate()) +
          "\xa0" +
          month[gbLaunch.getUTCMonth()] +
          (gbLaunch.getUTCFullYear() !== today.getUTCFullYear() && gbLaunch.getUTCFullYear() !== gbEnd.getUTCFullYear()
            ? " " + gbLaunch.getUTCFullYear()
            : "") +
          " until " +
          gbEnd.getUTCDate() +
          nth(gbEnd.getUTCDate()) +
          "\xa0" +
          month[gbEnd.getUTCMonth()] +
          (gbEnd.getUTCFullYear() !== today.getUTCFullYear() ? " " + gbEnd.getUTCFullYear() : "") +
          ".";
      } else if (set.gbLaunch.includes("Q")) {
        gb = "GB expected " + gbLaunch + ".";
      } else if (set.gbMonth && set.gbLaunch !== "") {
        gb = "Expected " + month[gbLaunch.getUTCMonth()] + ".";
      } else if (set.gbLaunch !== "") {
        gb =
          verb +
          " from " +
          gbLaunch.getUTCDate() +
          nth(gbLaunch.getUTCDate()) +
          "\xa0" +
          month[gbLaunch.getUTCMonth()] +
          (gbLaunch.getUTCFullYear() !== today.getUTCFullYear() && gbLaunch.getUTCFullYear() !== gbEnd.getUTCFullYear()
            ? " " + gbLaunch.getUTCFullYear()
            : "") +
          ".";
      } else {
        gb = false;
      }
      chipsContent.forEach((prop) => {
        if (prop === "vendors") {
          sortedVendors.forEach((vendor) => {
            chips.push(vendor.name);
          });
        } else {
          if (!Array.isArray(set[prop])) {
            chips.push(set[prop]);
          } else {
            set[prop].forEach((entry) => {
              chips.push(entry);
            });
          }
        }
      });
      shippedLine =
        gbEnd <= today ? (
          this.props.set.shipped ? (
            <Typography use="body2" tag="p">
              This set has shipped.
            </Typography>
          ) : (
            <Typography use="body2" tag="p">
              This set has not shipped.
            </Typography>
          )
        ) : (
          ""
        );
    }
    const gbLine = gb ? (
      <Typography use="body2" tag="p">
        {gb}
      </Typography>
    ) : (
      ""
    );
    if (set.vendors) {
      vendorList = (
        <div className="details-list">
          <Typography className="subheader" use="caption" tag="h4">
            Vendors
          </Typography>
          <List twoLine>
            {sortedVendors.map((vendor, index) => {
              if (vendor.storeLink !== "") {
                return (
                  <ListItem key={index} tag="a" href={vendor.storeLink} target="_blank" rel="noopener noreferrer">
                    <ListItemText>
                      <ListItemPrimaryText>{vendor.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>{vendor.region}</ListItemSecondaryText>
                    </ListItemText>
                    <ListItemMeta icon="launch" />
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={index} disabled>
                    <ListItemText>
                      <ListItemPrimaryText>{vendor.name}</ListItemPrimaryText>
                      <ListItemSecondaryText>{vendor.region}</ListItemSecondaryText>
                    </ListItemText>
                  </ListItem>
                );
              }
            })}
          </List>
        </div>
      );
    } else {
      if (set.storeLink) {
        vendorList = (
          <div className="details-list">
            <Typography className="subheader" use="caption" tag="h4">
              Vendors
            </Typography>
            <List>
              <ListItem tag="a" href={set.storeLink} target="_blank" rel="noopener noreferrer">
                <ListItemText>
                  <ListItemPrimaryText>{set.vendor ? set.vendor : ""}</ListItemPrimaryText>
                </ListItemText>
                <ListItemMeta icon="launch" />
              </ListItem>
            </List>
          </div>
        );
      } else {
        vendorList = (
          <div className="details-list">
            <Typography className="subheader" use="caption" tag="h4">
              Vendors
            </Typography>
            <List>
              <ListItem disabled>
                <ListItemText>
                  <ListItemPrimaryText>{set.vendor ? set.vendor : ""}</ListItemPrimaryText>
                </ListItemText>
              </ListItem>
            </List>
          </div>
        );
      }
    }
    const editorButtons =
      this.props.user.isEditor ||
      (this.props.user.isDesigner && set.designer && set.designer.indexOf(this.props.user.nickname) > -1) ? (
        <div className="editor-buttons">
          <Button className="edit" outlined label="Edit" onClick={() => this.props.edit(set)} icon="edit" />
          {this.props.user.isEditor ? (
            <Button
              className="delete"
              outlined
              danger
              label="Delete"
              onClick={() => this.props.delete(this.props.set)}
            />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div></div>
      );
    const lichButton =
      this.props.set.colorway === "Lich" ? <IconButton icon="palette" onClick={this.props.toggleLichTheme} /> : null;
    return (
      <Drawer modal open={this.props.open} onClose={this.props.close} className="details-drawer drawer-right">
        <DrawerHeader>
          <DrawerTitle>Details</DrawerTitle>
          {lichButton}
        </DrawerHeader>
        <DrawerContent>
          <div className="details-image" style={{ backgroundImage: "url(" + set.image + ")" }}></div>
          <div className="details-text">
            <Typography use="overline" tag="h3">
              Designed by {set.designer ? set.designer.toString().replace(/,/g, " + ") : ""}
            </Typography>
            <Typography use="headline4" tag="h1">
              <Twemoji options={{ className: "twemoji" }}>
                {(set.profile ? set.profile : "") + " " + (set.colorway ? set.colorway : "")}
              </Twemoji>
            </Typography>
            {gbLine}
            {shippedLine}
            <Typography use="body2" tag="p">
              {ic}
            </Typography>
          </div>
          <div className="details-button">
            <Button outlined label="Link" tag="a" href={set.details} target="_blank" rel="noopener noreferrer" />
          </div>
          {vendorList}
        </DrawerContent>
        {editorButtons}
        <div className="search-chips-container">
          <div className="search-chips">
            <ChipSet choice>
              {chips.map((value, index) => {
                return (
                  <Chip
                    icon="search"
                    label={value}
                    key={value.toLowerCase() + index}
                    selected={this.props.search.toLowerCase() === value.toLowerCase()}
                    onClick={() => {
                      this.props.setSearch(value);
                      this.props.close();
                    }}
                  />
                );
              })}
            </ChipSet>
          </div>
        </div>
      </Drawer>
    );
  }
}

export default DesktopDrawerDetails;
