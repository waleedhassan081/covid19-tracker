import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Infobox.css";
function Infoboxes({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} ${
                active && isRed && "infoBox--red"
            }`}
        >
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${!isRed && "infoBox--green"}`}>
                    {cases}
                </h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Infoboxes;
