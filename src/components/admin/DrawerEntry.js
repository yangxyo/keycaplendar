import React from "react";
import firebase from "../firebase";
import { ImageUpload } from "./ImageUpload";
import { Autocomplete } from "../common/Autocomplete";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@rmwc/drawer";
import { TextField } from "@rmwc/textfield";
import { Typography } from "@rmwc/typography";
import { Checkbox } from "@rmwc/checkbox";
import { LinearProgress } from "@rmwc/linear-progress";
import { MenuSurfaceAnchor } from "@rmwc/menu";
import { Card, CardActions, CardActionButtons, CardActionButton } from "@rmwc/card";
import { Button } from "@rmwc/button";
import "./DrawerEntry.scss";

export class DrawerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: "",
      colorway: "",
      designer: [],
      icDate: "",
      details: "",
      image: null,
      gbMonth: true,
      gbLaunch: "",
      gbEnd: "",
      shipped: false,
      vendors: [],
      loading: false,
      imageUploadProgress: 0,
      imageURL: "",
      focused: "",
    };
  }

  closeDrawer = () => {
    this.props.close();
    this.setState({
      profile: "",
      colorway: "",
      designer: [],
      icDate: "",
      details: "",
      image: null,
      gbMonth: true,
      gbLaunch: "",
      gbEnd: "",
      shipped: false,
      vendors: [],
      loading: false,
      imageUploadProgress: 0,
      imageURL: "",
      focused: "",
    });
  };

  setImage = (image) => {
    //resize image to 480px height
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event) => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const elem = document.createElement("canvas");
        const width = img.width * (480 / img.height);
        const height = 480;
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob((blob) => {
          this.setState({
            image: blob,
          });
        }, "image/png");
        reader.onerror = (error) => this.props.snackbarQueue.notify({ title: "Failed to set image: " + error });
      };
    };
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

  selectValue = (prop, value) => {
    if (prop === "designer") {
      this.setState({
        [prop]: [value],
        focused: "",
      });
    } else {
      this.setState({
        [prop]: value,
        focused: "",
      });
    }
  };

  selectVendor = (prop, value) => {
    const property = prop.slice(0, -1);
    const index = prop.slice(prop.length - 1);
    let vendorsCopy = this.state.vendors;
    vendorsCopy[index][property] = value;
    this.setState({
      vendors: vendorsCopy,
      focused: "",
    });
  };

  handleChange = (e) => {
    if (e.target.name === "designer") {
      this.setState({
        [e.target.name]: e.target.value.split(", "),
      });
    } else if (e.target.name === "shipped") {
      this.setState({
        [e.target.name]: e.target.checked,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleChangeVendor = (e) => {
    let vendors = this.state.vendors;
    const field = e.target.name.replace(/\d/g, "");
    const index = e.target.name.replace(/\D/g, "");
    vendors[index][field] = e.target.value;
    this.setState({
      vendors: vendors,
    });
  };

  toggleDate = () => {
    this.setState({
      gbMonth: !this.state.gbMonth,
    });
  };

  addVendor = () => {
    let vendors = this.state.vendors;
    const emptyVendor = {
      name: "",
      region: "",
      storeLink: "",
    };
    vendors.push(emptyVendor);
    this.setState({
      vendors: vendors,
    });
  };

  removeVendor = (index) => {
    let vendors = this.state.vendors;
    vendors.splice(index, 1);
    this.setState({
      vendors: vendors,
    });
  };

  moveVendor = (index) => {
    function array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    }
    let vendors = this.state.vendors;
    array_move(vendors, index, index - 1);
    this.setState({
      vendors: vendors,
    });
  };

  uploadImage = () => {
    this.setState({ loading: true });
    const storageRef = firebase.storage().ref();
    const keysetsRef = storageRef.child("keysets");
    const fileName =
      this.state.profile.toLowerCase() +
      this.state.colorway
        .normalize("NFD")
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/\W+(.)/g, function (match, chr) {
          return chr.toUpperCase();
        });
    const imageRef = keysetsRef.child(fileName + ".png");
    const uploadTask = imageRef.put(this.state.image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ imageUploadProgress: progress });
      },
      (error) => {
        // Handle unsuccessful uploads
        this.props.snackbarQueue.notify({ title: "Failed to upload image: " + error });
        this.setState({ loading: false });
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        this.props.snackbarQueue.notify({ title: "Successfully uploaded image." });
        imageRef
          .getDownloadURL()
          .then((downloadURL) => {
            this.setState({
              imageURL: downloadURL,
              loading: false,
            });
            this.createEntry();
          })
          .catch((error) => {
            this.props.snackbarQueue.notify({ title: "Failed to get URL: " + error });
            this.setState({
              loading: false,
            });
          });
      }
    );
  };

  createEntry = () => {
    if (
      this.state.profile !== "" &&
      this.state.colorway !== "" &&
      this.state.designer !== [] &&
      this.state.icDate !== "" &&
      this.state.details !== "" &&
      this.state.imagePath !== ""
    ) {
      const db = firebase.firestore();
      db.collection("keysets")
        .add({
          profile: this.state.profile,
          colorway: this.state.colorway,
          designer: this.state.designer,
          icDate: this.state.icDate,
          details: this.state.details,
          shipped: this.state.shipped,
          image: this.state.imageURL,
          gbMonth: this.state.gbMonth,
          gbLaunch: this.state.gbLaunch,
          gbEnd: this.state.gbEnd,
          vendors: this.state.vendors,
          latestEditor: this.props.user.id,
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          this.props.snackbarQueue.notify({ title: "Entry written successfully." });
          this.props.getData();
          this.closeDrawer();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
          this.props.snackbarQueue.notify({ title: "Error adding document: " + error });
        });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      if (this.props.user.isEditor === false && this.props.user.isDesigner) {
        this.setState({
          designer: [this.props.user.nickname],
        });
      }
    }
  }

  render() {
    const formFilled =
      this.state.profile !== "" &&
      this.state.colorway !== "" &&
      this.state.designer !== [] &&
      this.state.icDate !== "" &&
      this.state.details !== "" &&
      this.state.image;
    const dateCard = this.state.gbMonth ? (
      <Card outlined className="date-container">
        <Typography use="caption" tag="h3" className="date-title">
          Month
        </Typography>
        <div className="date-form">
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB month"
            pattern="^\d{4}-\d{1,2}$"
            value={this.state.gbLaunch}
            name="gbLaunch"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM" }}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton
              label="Date"
              onClick={(e) => {
                e.preventDefault();
                this.toggleDate();
              }}
            />
          </CardActionButtons>
        </CardActions>
      </Card>
    ) : (
      <Card outlined className="date-container">
        <Typography use="caption" tag="h3" className="date-title">
          Date
        </Typography>
        <div className="date-form">
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB launch"
            pattern="^\d{4}-\d{1,2}-\d{1,2}$|^Q\d{1} \d{4}$"
            value={this.state.gbLaunch}
            name="gbLaunch"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD or Q1-4 YYYY" }}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB end"
            pattern="^\d{4}-\d{1,2}-\d{1,2}$"
            value={this.state.gbEnd}
            name="gbEnd"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD" }}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton
              label="Month"
              onClick={(e) => {
                e.preventDefault();
                this.toggleDate();
              }}
            />
          </CardActionButtons>
        </CardActions>
      </Card>
    );
    return (
      <Drawer modal open={this.props.open} onClose={this.closeDrawer} className="entry-drawer drawer-right">
        <DrawerHeader>
          <DrawerTitle>Create Entry</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <div className="banner">
            <div className="banner-text">Make sure to read the entry guide.</div>
            <div className="banner-button">
              <a href="/guide/entries" target="_blank" rel="noopener noreferrer">
                <Button label="guide" />
              </a>
            </div>
          </div>
          <form className="form">
            <div className="form-double">
              <div className="select-container">
                <MenuSurfaceAnchor>
                  <TextField
                    autoComplete="off"
                    outlined
                    required
                    label="Profile"
                    value={this.state.profile}
                    name="profile"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                  <Autocomplete
                    open={this.state.focused === "profile"}
                    array={this.props.profiles}
                    query={this.state.profile}
                    prop="profile"
                    select={this.selectValue}
                    minChars={1}
                  />
                </MenuSurfaceAnchor>
              </div>
              <div className="field-container">
                <TextField
                  autoComplete="off"
                  className="field"
                  outlined
                  required
                  label="Colorway"
                  value={this.state.colorway}
                  name="colorway"
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleBlur}
                />
              </div>
            </div>
            <MenuSurfaceAnchor>
              <TextField
                autoComplete="off"
                outlined
                label="Designer"
                required
                pattern="(\w+)[^\s](,\s*.+)*"
                value={this.state.designer.toString().replace(/,/g, ", ")}
                name="designer"
                helpText={{
                  persistent: false,
                  validationMsg: true,
                  children:
                    this.state.designer[0] && this.state.designer[0].indexOf(" ") >= 0
                      ? "Separate multiple designers with a comma"
                      : "",
                }}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                disabled={this.props.user.isEditor === false && this.props.user.isDesigner}
              />
              <Autocomplete
                open={this.state.focused === "designer"}
                array={this.props.allDesigners}
                query={this.state.designer.toString().replace(/,/g, ", ")}
                prop="designer"
                select={this.selectValue}
                minChars={2}
              />
            </MenuSurfaceAnchor>
            <TextField
              autoComplete="off"
              icon="calendar_today"
              outlined
              label="IC date"
              required
              pattern="^\d{4}-\d{1,2}-\d{1,2}$"
              value={this.state.icDate}
              name="icDate"
              helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD" }}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <TextField
              autoComplete="off"
              icon="link"
              outlined
              label="Details"
              required
              pattern="https?:\/\/.+"
              value={this.state.details}
              name="details"
              helpText={{ persistent: false, validationMsg: true, children: "Must be valid link" }}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
            <ImageUpload
              image={this.state.image}
              setImage={this.setImage}
              snackbarQueue={this.props.snackbarQueue}
              desktop
            />
            {dateCard}
            <Checkbox label="Shipped" name="shipped" checked={this.state.shipped} onChange={this.handleChange} />
            {this.state.vendors.map((vendor, index) => {
              const moveUp =
                index !== 0 ? (
                  <CardActionButton
                    label="Move Up"
                    onClick={(e) => {
                      e.preventDefault();
                      this.moveVendor(index);
                    }}
                  />
                ) : (
                  ""
                );
              return (
                <Card key={index} outlined className="vendor-container">
                  <Typography use="caption" tag="h3" className="vendor-title">
                    {index > 0 ? "Vendor " + (index + 1) : "US vendor (or main vendor if no US vendor)"}
                  </Typography>
                  <div className="vendor-form">
                    <MenuSurfaceAnchor>
                      <TextField
                        autoComplete="off"
                        icon="store"
                        required
                        outlined
                        label="Name"
                        value={vendor.name}
                        name={"name" + index}
                        onChange={this.handleChangeVendor}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                      />
                      <Autocomplete
                        open={this.state.focused === "name" + index}
                        array={this.props.allVendors}
                        query={this.state.vendors[index].name}
                        prop={"name" + index}
                        select={this.selectVendor}
                        minChars={1}
                      />
                    </MenuSurfaceAnchor>
                    <MenuSurfaceAnchor>
                      <TextField
                        autoComplete="off"
                        icon="public"
                        required
                        outlined
                        label="Region"
                        value={vendor.region}
                        name={"region" + index}
                        onChange={this.handleChangeVendor}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                      />
                      <Autocomplete
                        open={this.state.focused === "region" + index}
                        array={this.props.allRegions}
                        query={this.state.vendors[index].region}
                        prop={"region" + index}
                        select={this.selectVendor}
                        minChars={1}
                      />
                    </MenuSurfaceAnchor>
                    <TextField
                      autoComplete="off"
                      icon="link"
                      outlined
                      label="Store link"
                      pattern="https?:\/\/.+"
                      value={vendor.storeLink}
                      name={"storeLink" + index}
                      onChange={this.handleChangeVendor}
                      onFocus={this.handleFocus}
                      onBlur={this.handleBlur}
                      helpText={{ persistent: false, validationMsg: true, children: "Must be valid link" }}
                    />
                  </div>

                  <CardActions className="remove-button">
                    <CardActionButtons>
                      <CardActionButton
                        label="Remove"
                        onClick={(e) => {
                          e.preventDefault();
                          this.removeVendor(index);
                        }}
                      />
                      {moveUp}
                    </CardActionButtons>
                  </CardActions>
                </Card>
              );
            })}
            <div className="add-button">
              <Button
                outlined
                label="Add vendor"
                onClick={(e) => {
                  e.preventDefault();
                  this.addVendor();
                }}
              />
            </div>
          </form>
        </DrawerContent>
        <div className="drawer-footer">
          <LinearProgress closed={!this.state.loading} progress={this.state.imageUploadProgress} />
          <Button
            outlined
            label="Save"
            onClick={(e) => {
              if (formFilled) {
                this.uploadImage(e);
              }
            }}
            disabled={!formFilled}
          />
        </div>
      </Drawer>
    );
  }
}

export class DrawerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      profile: "",
      colorway: "",
      designer: [],
      icDate: "",
      details: "",
      image: "",
      gbMonth: false,
      gbLaunch: "",
      gbEnd: "",
      shipped: false,
      vendors: [],
      loading: false,
      imageUploadProgress: 0,
      imageURL: "",
      newImage: false,
      focused: "",
    };
  }

  setValues = () => {
    let gbLaunch = "";
    if (this.props.set.gbMonth) {
      const twoNumRegExp = /^\d{4}-\d{1,2}-\d{2}$/g;
      const oneNumRegExp = /^\d{4}-\d{1,2}-\d{1}$/g;
      if (twoNumRegExp.test(this.props.set.gbLaunch)) {
        gbLaunch = this.props.set.gbLaunch.slice(0, -3);
      } else if (oneNumRegExp.test(this.props.set.gbLaunch)) {
        gbLaunch = this.props.set.gbLaunch.slice(0, -2);
      } else {
        gbLaunch = this.props.set.gbLaunch;
      }
    } else {
      gbLaunch = this.props.set.gbLaunch;
    }
    this.setState({
      id: this.props.set.id,
      profile: this.props.set.profile,
      colorway: this.props.set.colorway,
      designer: this.props.set.designer,
      icDate: this.props.set.icDate,
      details: this.props.set.details,
      image: this.props.set.image,
      imageURL: this.props.set.image,
      gbMonth: this.props.set.gbMonth,
      gbLaunch: gbLaunch,
      gbEnd: this.props.set.gbEnd,
      shipped: this.props.set.shipped ? this.props.set.shipped : false,
      vendors: this.props.set.vendors,
    });
  };
  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open && this.props.open) {
      this.setValues();
    }
  }

  closeDrawer = () => {
    this.setState({
      id: "",
      profile: "",
      colorway: "",
      designer: [],
      icDate: "",
      details: "",
      image: "",
      gbMonth: false,
      gbLaunch: "",
      gbEnd: "",
      shipped: false,
      vendors: [],
      loading: false,
      imageUploadProgress: 0,
      imageURL: "",
      newImage: false,
      focused: "",
    });
    this.props.close();
  };

  setImage = (image) => {
    //resize image to 480px height
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (event) => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const elem = document.createElement("canvas");
        const width = img.width * (480 / img.height);
        const height = 480;
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext("2d");
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, height);
        ctx.canvas.toBlob((blob) => {
          this.setState({
            image: blob,
            newImage: true,
          });
        }, "image/png");
        reader.onerror = (error) => this.props.snackbarQueue.notify({ title: "Failed to set image: " + error });
      };
    };
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

  selectValue = (prop, value) => {
    if (prop === "designer") {
      this.setState({
        [prop]: [value],
        focused: "",
      });
    } else {
      this.setState({
        [prop]: value,
        focused: "",
      });
    }
  };

  selectVendor = (prop, value) => {
    const property = prop.slice(0, -1);
    const index = prop.slice(prop.length - 1);
    let vendorsCopy = this.state.vendors;
    vendorsCopy[index][property] = value;
    this.setState({
      vendors: vendorsCopy,
      focused: "",
    });
  };

  handleChange = (e) => {
    if (e.target.name === "designer") {
      this.setState({
        [e.target.name]: e.target.value.split(", "),
      });
    } else if (e.target.name === "shipped") {
      this.setState({
        [e.target.name]: e.target.checked,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };

  handleChangeVendor = (e) => {
    let vendors = this.state.vendors;
    const field = e.target.name.replace(/\d/g, "");
    const index = e.target.name.replace(/\D/g, "");
    vendors[index][field] = e.target.value;
    this.setState({
      vendors: vendors,
    });
  };

  toggleDate = () => {
    this.setState({
      gbMonth: !this.state.gbMonth,
    });
  };

  addVendor = () => {
    let vendors = this.state.vendors;
    const emptyVendor = {
      name: "",
      region: "",
      storeLink: "",
    };
    vendors.push(emptyVendor);
    this.setState({
      vendors: vendors,
    });
  };

  removeVendor = (index) => {
    let vendors = this.state.vendors;
    vendors.splice(index, 1);
    this.setState({
      vendors: vendors,
    });
  };

  moveVendor = (index) => {
    function array_move(arr, old_index, new_index) {
      if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
          arr.push(undefined);
        }
      }
      arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
      return arr; // for testing
    }
    let vendors = this.state.vendors;
    array_move(vendors, index, index - 1);
    this.setState({
      vendors: vendors,
    });
  };

  uploadImage = () => {
    this.setState({ loading: true });
    const storageRef = firebase.storage().ref();
    const keysetsRef = storageRef.child("keysets");
    const fileName =
      this.state.profile.toLowerCase() +
      this.state.colorway
        .normalize("NFD")
        .replace(/[^a-zA-Z0-9]/g, "")
        .replace(/\W+(.)/g, function (match, chr) {
          return chr.toUpperCase();
        });
    const imageRef = keysetsRef.child(fileName + ".png");
    const uploadTask = imageRef.put(this.state.image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.setState({ imageUploadProgress: progress });
      },
      (error) => {
        // Handle unsuccessful uploads
        this.props.snackbarQueue.notify({ title: "Failed to upload image: " + error });
        this.setState({ loading: false });
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        this.props.snackbarQueue.notify({ title: "Successfully uploaded image." });
        imageRef
          .getDownloadURL()
          .then((downloadURL) => {
            this.setState({
              imageURL: downloadURL,
              loading: false,
            });
            this.editEntry();
          })
          .catch((error) => {
            this.props.snackbarQueue.notify({ title: "Failed to get URL: " + error });
            this.setState({
              loading: false,
            });
          });
      }
    );
  };

  editEntry = () => {
    const db = firebase.firestore();
    db.collection("keysets")
      .doc(this.state.id)
      .update({
        profile: this.state.profile,
        colorway: this.state.colorway,
        designer: this.state.designer,
        icDate: this.state.icDate,
        details: this.state.details,
        image: this.state.imageURL,
        gbMonth: this.state.gbMonth,
        gbLaunch: this.state.gbLaunch,
        gbEnd: this.state.gbEnd,
        shipped: this.state.shipped,
        vendors: this.state.vendors,
        latestEditor: this.props.user.id,
      })
      .then((docRef) => {
        this.props.snackbarQueue.notify({ title: "Entry edited successfully." });
        this.closeDrawer();
        this.props.getData();
      })
      .catch((error) => {
        this.props.snackbarQueue.notify({ title: "Error editing document: " + error });
      });
  };

  render() {
    const formFilled =
      this.state.profile !== "" &&
      this.state.colorway !== "" &&
      this.state.designer !== [] &&
      this.state.icDate !== "" &&
      this.state.details !== "" &&
      this.state.image;
    const dateCard = this.state.gbMonth ? (
      <Card outlined className="date-container">
        <Typography use="caption" tag="h3" className="date-title">
          Month
        </Typography>
        <div className="date-form">
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB month"
            pattern="^\d{4}-\d{1,2}$"
            value={this.state.gbLaunch}
            name="gbLaunch"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM" }}
            onChange={this.handleChange}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton
              label="Date"
              onClick={(e) => {
                e.preventDefault();
                this.toggleDate();
              }}
            />
          </CardActionButtons>
        </CardActions>
      </Card>
    ) : (
      <Card outlined className="date-container">
        <Typography use="caption" tag="h3" className="date-title">
          Date
        </Typography>
        <div className="date-form">
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB launch"
            pattern="^\d{4}-\d{1,2}-\d{1,2}$|^Q\d{1} \d{4}$"
            value={this.state.gbLaunch}
            name="gbLaunch"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD or Q1-4 YYYY" }}
            onChange={this.handleChange}
          />
          <TextField
            autoComplete="off"
            icon="calendar_today"
            outlined
            label="GB end"
            pattern="^\d{4}-\d{1,2}-\d{1,2}$"
            value={this.state.gbEnd}
            name="gbEnd"
            helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD" }}
            onChange={this.handleChange}
          />
        </div>
        <CardActions>
          <CardActionButtons>
            <CardActionButton
              label="Month"
              onClick={(e) => {
                e.preventDefault();
                this.toggleDate();
              }}
            />
          </CardActionButtons>
        </CardActions>
      </Card>
    );
    return (
      <Drawer modal open={this.props.open} onClose={this.props.close} className="entry-drawer drawer-right">
        <DrawerHeader>
          <DrawerTitle>Edit Entry</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <div className="banner">
            <div className="banner-text">Make sure to read the entry guide.</div>
            <div className="banner-button">
              <a href="/guide/entries" target="_blank" rel="noopener noreferrer">
                <Button label="guide" />
              </a>
            </div>
          </div>
          <form className="form">
            <div className="form-double">
              <div className="select-container">
                <MenuSurfaceAnchor>
                  <TextField
                    autoComplete="off"
                    outlined
                    required
                    label="Profile"
                    value={this.state.profile}
                    name="profile"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                  />
                  <Autocomplete
                    open={this.state.focused === "profile"}
                    array={this.props.profiles}
                    query={this.state.profile}
                    prop="profile"
                    select={this.selectValue}
                    minChars={1}
                  />
                </MenuSurfaceAnchor>
              </div>
              <div className="field-container">
                <TextField
                  autoComplete="off"
                  className="field"
                  outlined
                  required
                  label="Colorway"
                  value={this.state.colorway}
                  name="colorway"
                  helpText={{ persistent: false, validationMsg: true, children: "Enter a name" }}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <MenuSurfaceAnchor>
              <TextField
                autoComplete="off"
                outlined
                label="Designer"
                required
                pattern="(\w+)[^\s](,\s*.+)*"
                value={this.state.designer.toString().replace(/,/g, ", ")}
                name="designer"
                helpText={{
                  persistent: false,
                  validationMsg: true,
                  children:
                    this.state.designer[0] && this.state.designer[0].indexOf(" ") >= 0
                      ? "Separate multiple designers with a comma"
                      : "",
                }}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                disabled={this.props.user.isEditor === false && this.props.user.isDesigner}
              />
              <Autocomplete
                open={this.state.focused === "designer"}
                array={this.props.allDesigners}
                query={this.state.designer.toString().replace(/,/g, ", ")}
                prop="designer"
                select={this.selectValue}
                minChars={2}
              />
            </MenuSurfaceAnchor>
            <TextField
              autoComplete="off"
              icon="calendar_today"
              outlined
              label="IC date"
              required
              pattern="^\d{4}-\d{1,2}-\d{1,2}$"
              value={this.state.icDate}
              name="icDate"
              helpText={{ persistent: true, validationMsg: true, children: "Format: YYYY-MM-DD" }}
              onChange={this.handleChange}
            />
            <TextField
              autoComplete="off"
              icon="link"
              outlined
              label="Details"
              required
              pattern="https?:\/\/.+"
              value={this.state.details}
              name="details"
              helpText={{
                persistent: false,
                validationMsg: true,
                children: this.state.details.length > 0 ? "Must be valid link" : "Enter a link",
              }}
              onChange={this.handleChange}
            />
            <ImageUpload
              image={this.state.image}
              setImage={this.setImage}
              snackbarQueue={this.props.snackbarQueue}
              desktop
            />
            {dateCard}
            <Checkbox label="Shipped" name="shipped" checked={this.state.shipped} onChange={this.handleChange} />
            {this.state.vendors.map((vendor, index) => {
              const moveUp =
                index !== 0 ? (
                  <CardActionButton
                    label="Move Up"
                    onClick={(e) => {
                      e.preventDefault();
                      this.moveVendor(index);
                    }}
                  />
                ) : (
                  ""
                );
              return (
                <Card key={index} outlined className="vendor-container">
                  <Typography use="caption" tag="h3" className="vendor-title">
                    {index > 0 ? "Vendor " + (index + 1) : "US vendor (or main vendor if no US vendor)"}
                  </Typography>
                  <div className="vendor-form">
                    <MenuSurfaceAnchor>
                      <TextField
                        autoComplete="off"
                        icon="store"
                        required
                        outlined
                        label="Name"
                        value={vendor.name}
                        name={"name" + index}
                        onChange={this.handleChangeVendor}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                      />
                      <Autocomplete
                        open={this.state.focused === "name" + index}
                        array={this.props.allVendors}
                        query={this.state.vendors[index].name}
                        prop={"name" + index}
                        select={this.selectVendor}
                        minChars={1}
                      />
                    </MenuSurfaceAnchor>
                    <MenuSurfaceAnchor>
                      <TextField
                        autoComplete="off"
                        icon="public"
                        required
                        outlined
                        label="Region"
                        value={vendor.region}
                        name={"region" + index}
                        onChange={this.handleChangeVendor}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                      />
                      <Autocomplete
                        open={this.state.focused === "region" + index}
                        array={this.props.allRegions}
                        query={this.state.vendors[index].region}
                        prop={"region" + index}
                        select={this.selectVendor}
                        minChars={1}
                      />
                    </MenuSurfaceAnchor>
                    <TextField
                      autoComplete="off"
                      icon="link"
                      outlined
                      label="Store link"
                      pattern="https?:\/\/.+"
                      value={vendor.storeLink}
                      name={"storeLink" + index}
                      onChange={this.handleChangeVendor}
                      helpText={{ persistent: false, validationMsg: true, children: "Must be valid link" }}
                    />
                  </div>
                  <CardActions className="remove-button">
                    <CardActionButtons>
                      <CardActionButton
                        label="Remove"
                        onClick={(e) => {
                          e.preventDefault();
                          this.removeVendor(index);
                        }}
                      />
                      {moveUp}
                    </CardActionButtons>
                  </CardActions>
                </Card>
              );
            })}
            <div className="add-button">
              <Button
                outlined
                label="Add vendor"
                onClick={(e) => {
                  e.preventDefault();
                  this.addVendor();
                }}
              />
            </div>
          </form>
        </DrawerContent>
        <div className="drawer-footer">
          <LinearProgress closed={!this.state.loading} progress={this.state.imageUploadProgress} />
          <Button
            outlined
            label="Save"
            onClick={(e) => {
              if (formFilled) {
                e.preventDefault();
                if (this.state.newImage) {
                  this.uploadImage();
                } else {
                  this.editEntry();
                }
              }
            }}
            disabled={!formFilled}
          />
        </div>
      </Drawer>
    );
  }
}

export default DrawerCreate;
