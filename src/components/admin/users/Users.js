import React from "react";
import firebase from "../../firebase";
import { Link } from "react-router-dom";
import {
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarNavigationIcon,
  TopAppBarFixedAdjust,
  TopAppBarActionItem,
} from "@rmwc/top-app-bar";
import {
  DataTable,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableBody,
} from "@rmwc/data-table";
import { CircularProgress } from "@rmwc/circular-progress";
import { IconButton } from "@rmwc/icon-button";
import { Menu, MenuItem, MenuSurfaceAnchor } from "@rmwc/menu";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from "@rmwc/dialog";
import { UserRow } from "./UserRow";
import { UserCard } from "./UserCard";
import "./Users.scss";
export class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      deleteDialogOpen: false,
      deletedUser: { displayName: "" },
      loading: false,
      view: "table",
      viewMenuOpen: false,
      sort: "nickname",
      sortMenuOpen: false,
      reverseSort: false,
    };
  }
  getUsers = () => {
    this.setState({ loading: true });
    const listUsersFn = firebase.functions().httpsCallable("listUsers");
    listUsersFn()
      .then((result) => {
        if (result) {
          if (result.data.error) {
            this.props.snackbarQueue.notify({ title: result.data.error });
            this.setState({
              loading: false,
            });
          } else {
            this.setState({
              loading: false,
            });
            this.sortUsers(result.data);
          }
        }
      })
      .catch((error) => {
        this.props.snackbarQueue.notify({ title: "Error listing users: " + error });
        this.setState({
          loading: false,
        });
      });
  };
  sortUsers = (users = this.state.users, sort = this.state.sort, reverseSort = this.state.reverseSort) => {
    users.sort((a, b) => {
      if (typeof a[sort] === "string") {
        const x = a[sort].toLowerCase();
        const y = b[sort].toLowerCase();
        if (x < y) {
          return reverseSort ? 1 : -1;
        }
        if (x > y) {
          return reverseSort ? -1 : 1;
        }
        if (a.nickname.toLowerCase() > b.nickname.toLowerCase()) {
          return 1;
        }
        if (a.nickname.toLowerCase() < b.nickname.toLowerCase()) {
          return -1;
        }
        if (a.email.toLowerCase() > b.email.toLowerCase()) {
          return 1;
        }
        if (a.email.toLowerCase() < b.email.toLowerCase()) {
          return -1;
        }
        return 0;
      } else {
        const x = a[sort];
        const y = b[sort];
        if (x < y) {
          return reverseSort ? -1 : 1;
        }
        if (x > y) {
          return reverseSort ? 1 : -1;
        }
        if (a.nickname.toLowerCase() > b.nickname.toLowerCase()) {
          return 1;
        }
        if (a.nickname.toLowerCase() < b.nickname.toLowerCase()) {
          return -1;
        }
        if (a.email.toLowerCase() > b.email.toLowerCase()) {
          return 1;
        }
        if (a.email.toLowerCase() < b.email.toLowerCase()) {
          return -1;
        }
        return 0;
      }
    });
    this.setState({
      users: users,
      loading: false,
    });
  };
  openDeleteDialog = (user) => {
    this.setState({
      deleteDialogOpen: true,
      deletedUser: user,
    });
  };
  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
    });
    setTimeout(() => {
      this.setState({
        deletedUser: { displayName: "" },
      });
    }, 75);
  };
  openViewMenu = () => {
    this.setState({
      viewMenuOpen: true,
    });
  };
  closeViewMenu = () => {
    this.setState({
      viewMenuOpen: false,
    });
  };
  setView = (index) => {
    const views = ["card", "table"];
    this.setState({
      view: views[index],
    });
  };
  openSortMenu = () => {
    this.setState({
      sortMenuOpen: true,
    });
  };
  closeSortMenu = () => {
    this.setState({
      sortMenuOpen: false,
    });
  };
  setSort = (sort) => {
    let reverseSort;
    if (sort === this.state.sort) {
      reverseSort = !this.state.reverseSort;
    } else {
      reverseSort = false;
    }
    this.setState({
      sort: sort,
      reverseSort: reverseSort,
    });
    this.sortUsers(this.state.users, sort, reverseSort);
  };
  setSortIndex = (index) => {
    const props = ["displayName", "email", "nickname"];
    this.setState({
      sort: props[index],
      reverseSort: false,
    });
    this.sortUsers(this.state.users, props[index], false);
  };
  deleteUser = (user) => {
    this.closeDeleteDialog();
    this.setState({ loading: true });
    const deleteUser = firebase.functions().httpsCallable("deleteUser");
    deleteUser(user)
      .then((result) => {
        if (result.data.error) {
          this.props.snackbarQueue.notify({ title: result.data.error });
          this.setState({
            loading: false,
          });
        } else {
          this.props.snackbarQueue.notify({ title: "User " + user.displayName + " successfully deleted." });
          this.getUsers();
        }
      })
      .catch((error) => {
        this.props.snackbarQueue.notify({ title: "Error deleting user: " + error });
        this.setState({
          loading: false,
        });
      });
  };
  componentDidMount() {
    this.getUsers();
  }
  render() {
    const refreshButton = this.state.loading ? (
      <CircularProgress />
    ) : (
      <TopAppBarActionItem icon="refresh" onClick={this.getUsers} />
    );
    const sortButton =
      this.state.view === "card" || this.props.device !== "desktop" ? (
        <MenuSurfaceAnchor>
          <Menu
            open={this.state.sortMenuOpen}
            anchorCorner="bottomLeft"
            onClose={this.closeSortMenu}
            onSelect={(e) => this.setSortIndex(e.detail.index)}
          >
            <MenuItem selected={this.state.sort === "displayName"}>Name</MenuItem>
            <MenuItem selected={this.state.sort === "email"}>Email</MenuItem>
            <MenuItem selected={this.state.sort === "nickname"}>Nickname</MenuItem>
          </Menu>
          <TopAppBarActionItem icon="sort" onClick={this.openSortMenu} />
        </MenuSurfaceAnchor>
      ) : null;
    const viewButton =
      this.props.device === "desktop" ? (
        <MenuSurfaceAnchor>
          <Menu
            open={this.state.viewMenuOpen}
            anchorCorner="bottomLeft"
            onClose={this.closeViewMenu}
            onSelect={(e) => this.setView(e.detail.index)}
          >
            <MenuItem selected={this.state.view === "card"}>Card</MenuItem>
            <MenuItem selected={this.state.view === "table"}>Table</MenuItem>
          </Menu>
          <TopAppBarActionItem
            icon={this.state.view === "card" ? "view_array" : "view_list"}
            onClick={this.openViewMenu}
            style={{ "--animation-delay": 3 }}
          />
        </MenuSurfaceAnchor>
      ) : null;
    return (
      <div>
        <TopAppBar fixed>
          <TopAppBarRow>
            <TopAppBarSection>
              <Link to="/">
                <TopAppBarNavigationIcon icon="arrow_back" />
              </Link>
              <TopAppBarTitle>Users</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
              {sortButton}
              {viewButton}
              {refreshButton}
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust />
        <div className="users-container-container">
          <div className="users-container">
            {this.state.view === "table" && this.props.device === "desktop" ? (
              <div className="users">
                <DataTable>
                  <DataTableContent>
                    <DataTableHead>
                      <DataTableRow>
                        <DataTableHeadCell></DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "displayName" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("displayName");
                          }}
                        >
                          User
                        </DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "email" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("email");
                          }}
                        >
                          Email
                        </DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "nickname" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("nickname");
                          }}
                        >
                          Nickname
                        </DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "designer" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("designer");
                          }}
                        >
                          Designer
                        </DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "editor" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("editor");
                          }}
                        >
                          Editor
                        </DataTableHeadCell>
                        <DataTableHeadCell
                          className={
                            "action" +
                            (this.state.sort === "admin" ? " sorted" : "") +
                            (this.state.reverseSort ? " reverse" : "")
                          }
                          onClick={() => {
                            this.setSort("admin");
                          }}
                        >
                          Admin
                        </DataTableHeadCell>
                        <DataTableHeadCell>Save</DataTableHeadCell>
                        <DataTableHeadCell>Delete</DataTableHeadCell>
                      </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                      {this.state.users.map((user, index) => {
                        return (
                          <UserRow
                            user={user}
                            currentUser={this.props.user}
                            delete={this.openDeleteDialog}
                            getUsers={this.getUsers}
                            snackbarQueue={this.props.snackbarQueue}
                            key={index}
                            allDesigners={this.props.allDesigners}
                          />
                        );
                      })}
                    </DataTableBody>
                  </DataTableContent>
                </DataTable>
              </div>
            ) : (
              <div className="user-container">
                {this.state.users.map((user, index) => {
                  return (
                    <div key={index}>
                      <UserCard
                        user={user}
                        currentUser={this.props.user}
                        delete={this.openDeleteDialog}
                        getUsers={this.getUsers}
                        snackbarQueue={this.props.snackbarQueue}
                        allDesigners={this.props.allDesigners}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <Dialog open={this.state.deleteDialogOpen}>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>Are you sure you want to delete the user {this.state.deletedUser.displayName}?</DialogContent>
          <DialogActions>
            <DialogButton action="close" onClick={this.closeDeleteDialog} isDefaultAction>
              Cancel
            </DialogButton>
            <DialogButton action="accept" className="delete" onClick={() => this.deleteUser(this.state.deletedUser)}>
              Delete
            </DialogButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default Users;
