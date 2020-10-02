import React from "react";
import firebase from "../../firebase";
import { Checkbox } from "@rmwc/checkbox";
import { CircularProgress } from "@rmwc/circular-progress";
import { MenuSurfaceAnchor } from "@rmwc/menu";
import { IconButton } from "@rmwc/icon-button";
import { TextField } from "@rmwc/textfield";
import { Avatar } from "@rmwc/avatar";
import { Autocomplete } from "../../common/Autocomplete";
import { Card, CardActions } from "@rmwc/card";
import {
  CollapsibleList,
  ListItem,
  ListItemMeta,
  ListItemText,
  ListItemPrimaryText,
  ListItemSecondaryText,
} from "@rmwc/list";
import { Typography } from "@rmwc/typography";
import { FormField } from "@rmwc/formfield";

export class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        nickname: "",
        designer: false,
        editor: false,
        admin: false,
      },
      edited: false,
      loading: false,
      focused: "",
    };
  }
  componentDidMount() {
    this.setState({ user: this.props.user });
  }
  componentDidUpdate() {
    if (this.props.user !== this.state.user) {
      this.setState({ user: this.props.user, edited: false });
    }
  }
  handleChange = (e) => {
    const newUser = this.state.user;
    newUser[e.target.name] = e.target.checked;
    if (e.target.name === "admin" && e.target.checked) {
      newUser.editor = true;
    }
    this.setState({
      user: newUser,
      edited: true,
    });
  };
  handleFocus = (e) => {
    this.setState({
      focused: e.target.name,
    });
  };
  handleBlur = () => {
    this.setState({
      focused: "",
    });
  };
  handleTextChange = (e) => {
    const newUser = this.state.user;
    newUser[e.target.name] = e.target.value;
    this.setState({
      user: newUser,
      edited: true,
    });
  };
  selectValue = (prop, value) => {
    const newUser = this.state.user;
    newUser[prop] = value;
    this.setState({
      user: newUser,
      edited: true,
    });
  };
  setRoles = () => {
    this.setState({ loading: true });
    const setRolesFn = firebase.functions().httpsCallable("setRoles");
    setRolesFn({
      email: this.state.user.email,
      nickname: this.state.user.nickname,
      designer: this.state.user.designer,
      editor: this.state.user.editor,
      admin: this.state.user.admin,
    }).then((result) => {
      this.setState({ loading: false });
      if (result.editor === this.state.editor && result.admin === this.state.admin) {
        this.props.snackbarQueue.notify({ title: "Successfully edited user permissions." });
        this.props.getUsers();
      } else if (result.error) {
        this.props.snackbarQueue.notify({ title: "Failed to edit user permissions: " + result.error });
      } else {
        this.props.snackbarQueue.notify({ title: "Failed to edit user permissions." });
      }
    });
  };
  render() {
    const user = this.state.user;
    const roles = ["designer", "editor", "admin"];
    const saveButton = this.state.loading ? (
      <CircularProgress />
    ) : (
      <IconButton
        icon="save"
        disabled={!this.state.edited}
        onClick={() => {
          if (this.state.edited) {
            this.setRoles();
          }
        }}
      />
    );
    const deleteButton =
      user.email === this.props.currentUser.email || user.email === "ben.j.durrant@gmail.com" ? (
        ""
      ) : (
        <IconButton
          icon="delete"
          onClick={() => {
            this.props.delete(user);
          }}
        />
      );
    return (
      <Card className="user">
        <CollapsibleList
          handle={
            <ListItem>
              <Avatar src={user.photoURL} className="mdc-list-item__graphic" size="xlarge" />
              <ListItemText>
                <div className="overline">{user.nickname}</div>
                <ListItemPrimaryText>{user.displayName}</ListItemPrimaryText>
                <ListItemSecondaryText>{user.email}</ListItemSecondaryText>
              </ListItemText>
              <ListItemMeta icon="expand_more" />
            </ListItem>
          }
        >
          <div className="text-field-container">
            <MenuSurfaceAnchor>
              <TextField
                outlined
                label="Nickname"
                className="nickname"
                name="nickname"
                onChange={this.handleTextChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                value={this.state.user.nickname}
              />
              <Autocomplete
                open={this.state.focused === "nickname"}
                array={this.props.allDesigners}
                query={this.state.user.nickname}
                prop="nickname"
                select={this.selectValue}
                minChars={2}
              />
            </MenuSurfaceAnchor>
          </div>
          <div className="roles-form">
            <div className="subheader">
              <Typography use="caption">Roles</Typography>
            </div>
            <div className="checkbox-group">
              {roles.map((role) => {
                return (
                  <FormField key={role}>
                    <Checkbox
                      label={role.charAt(0).toUpperCase() + role.slice(1)}
                      checked={user[role]}
                      name={role}
                      onClick={this.handleChange}
                      disabled={
                        (user.email === this.props.currentUser.email || user.email === "ben.j.durrant@gmail.com") &&
                        role !== "designer"
                      }
                    />
                  </FormField>
                );
              })}
            </div>
          </div>
        </CollapsibleList>
        <CardActions>
          {saveButton}
          {deleteButton}
        </CardActions>
      </Card>
    );
  }
}

export default UserCard;
