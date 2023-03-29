import React, {useState} from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

type IData = {
  label: string;
  value: number;
  children?: React.ReactNode;
};

type ITabPanel = {
  data: IData[];
};

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{py: 3}}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TabPanelComponent: React.FC<ITabPanel> = ({data}) => {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{width: '100%'}}>
      <Box sx={{ borderColor: 'divider'}}>
        <Tabs
          className="overflow-auto bg-white shadow border rounded-md mt-5"
          value={value}
          onChange={handleChange}
          variant="scrollable"
          // scrollButtons
          allowScrollButtonsMobile>
          {data.map((data: IData) => (
            <Tab
              className="overflow-auto"
              key={data.label}
              label={data?.label}
              {...a11yProps(data?.value)}
            />
          ))}
        </Tabs>
      </Box>

      {data.map((data: IData, index: number) => (
        <TabPanel key={index} value={value} index={index}>
          {data.children}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabPanelComponent;
