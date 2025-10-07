import { CircularProgress } from "@mui/material";
import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <CircularProgress enableTrackSlot size="5rem" />
    </div>
  );
}
