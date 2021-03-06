import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from "@rmwc/dialog";
import firebase from "../firebase";

export const DialogDelete = (props) => {
  const deleteEntry = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    db.collection("keysets")
      .doc(props.set.id)
      .set({
        latestEditor: props.user.id,
      })
      .then((docRef) => {
        props.openSnackbar();
        props.getData();
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
        props.snackbarQueue.notify({ title: "Error deleting document: " + error });
      });
    props.close();
  };
  return (
    <Dialog open={props.open}>
      <DialogTitle>Delete {props.set.profile + " " + props.set.colorway}</DialogTitle>
      <DialogContent>
        Are you sure you want to delete the entry for {props.set.profile + " " + props.set.colorway}?
      </DialogContent>
      <DialogActions>
        <DialogButton action="close" onClick={props.close} isDefaultAction>
          Cancel
        </DialogButton>
        <DialogButton action="accept" className="delete" onClick={deleteEntry}>
          Delete
        </DialogButton>
      </DialogActions>
    </Dialog>
  );
};

export default DialogDelete;
