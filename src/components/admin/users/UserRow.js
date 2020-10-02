import React from "react";
import firebase from "../../firebase";
import { Avatar } from "@rmwc/avatar";
import { Checkbox } from "@rmwc/checkbox";
import { CircularProgress } from "@rmwc/circular-progress";
import { DataTableRow, DataTableCell } from "@rmwc/data-table";
import { MenuSurfaceAnchor } from "@rmwc/menu";
import { IconButton } from "@rmwc/icon-button";
import { TextField } from "@rmwc/textfield";
import { Autocomplete } from "../../common/Autocomplete";

export class UserRow extends React.Component {
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
    const saveButton = this.state.loading ? (
      <CircularProgress />
    ) : (
      <IconButton
        icon="save"
        onClick={() => {
          if (this.state.edited) {
            this.setRoles();
          }
        }}
        disabled={!this.state.edited}
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
      <DataTableRow>
        <DataTableCell>
          <Avatar src={user.photoURL} name={user.displayName} size="large" />
        </DataTableCell>
        <DataTableCell>{user.displayName}</DataTableCell>
        <DataTableCell>{user.email}</DataTableCell>
        <DataTableCell>
          <MenuSurfaceAnchor>
            <TextField
              outlined
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
        </DataTableCell>
        <DataTableCell className="checkbox-cell">
          <Checkbox name="designer" checked={user.designer} onChange={this.handleChange} />
        </DataTableCell>
        <DataTableCell className="checkbox-cell">
          <Checkbox
            name="editor"
            checked={user.editor}
            onChange={this.handleChange}
            disabled={user.email === this.props.currentUser.email || user.email === "ben.j.durrant@gmail.com"}
          />
        </DataTableCell>
        <DataTableCell className="checkbox-cell">
          <Checkbox
            name="admin"
            checked={user.admin}
            onChange={this.handleChange}
            disabled={user.email === this.props.currentUser.email || user.email === "ben.j.durrant@gmail.com"}
          />
        </DataTableCell>
        <DataTableCell className="icon-cell">{saveButton}</DataTableCell>
        <DataTableCell className="icon-cell">{deleteButton}</DataTableCell>
      </DataTableRow>
    );
  }
}

export default UserRow;
