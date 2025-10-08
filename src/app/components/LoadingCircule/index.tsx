import { CircularProgress } from "@mui/material";
import React from "react";

export default function Loading({ size }: { size?: string | number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <CircularProgress enableTrackSlot size={size} />
    </div>
  );
}
