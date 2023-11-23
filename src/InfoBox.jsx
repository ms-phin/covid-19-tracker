import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@mui/material";

function InfoBox({ title, cases, total }) {
  return (
    <Card className="infobox">
      <CardContent className="card__info">
        <Typography className="card__info_p" color="textSecondary">
          {title}
        </Typography>
        <h2>{cases}</h2>
        <Typography className="card__info_p">{total} total</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
