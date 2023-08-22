import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import "./StarRating.scss";

export const StarRating = () => {
    const [value, setValue] = React.useState<number | null>(2);
    return (
        <div className="rating-container">
            <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
            <Typography component="legend" className='purchase-num'>11</Typography>
        </div>
    )
}
