import React from "react";
import { Snackbar, SnackbarAction } from "@rmwc/snackbar";
import firebase from "../firebase";

export const SnackbarDeleted = (props) => {
  const recreateEntry = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    db.collection("keysets")
      .add({
        profile: props.set.profile,
        colorway: props.set.colorway,
        designer: props.set.designer,
        icDate: props.set.icDate,
        details: props.set.details,
        image: props.set.image,
        gbLaunch: props.set.gbLaunch,
        gbEnd: props.set.gbEnd,
        vendors: props.set.vendors,
      })
      .then((docRef) => {
        console.log("Document recreated with ID: ", docRef.id);
        props.snackbarQueue.notify({ title: "Entry successfully recreated." });
        props.getData();
      })
      .catch((error) => {
        console.error("Error recreating document: ", error);
        props.snackbarQueue.notify({ title: "Error recreating document: " + error });
      });
    props.close();
  };
  return (
    <Snackbar
      open={props.open}
      message={props.set.profile + " " + props.set.colorway + " has been deleted."}
      onClose={props.close}
      action={<SnackbarAction label="Undo" onClick={recreateEntry} />}
    />
  );
};

export default SnackbarDeleted;
