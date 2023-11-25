import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@mui/material";

function InfoBox({ title, cases, total, ...props }) {
  return (
    <Card onClick={props.onClick} className="infobox">
      <CardContent className="card__info">
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <Typography className=" infoBox__cases">
          <h2>{cases}</h2>
        </Typography>
        <Typography className="infoBox__total">{total} total</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
