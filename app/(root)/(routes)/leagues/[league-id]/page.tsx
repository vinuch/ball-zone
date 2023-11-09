"use client"

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function LeagueId() {
    const [value, setValue] = React.useState(2);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>

            <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="disabled tabs example">
                <Tab label="Games" />
                <Tab label="Standings" />
                <Tab label="Stats" />
                <Tab label="Players" />
            </Tabs>
        </div>
    )
}
