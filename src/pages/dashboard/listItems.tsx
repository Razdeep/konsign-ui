import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';

import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { StarBorder } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function MainListItems() {
  const [expandedIndex, setExpandedIndex] = React.useState<Number>(-1);

  const toggleExpandedIndex = (index: Number) => {
    if (expandedIndex === index) {
      setExpandedIndex(-1);
    } else {
      setExpandedIndex(index);
    }
  }

  return (<List>
    <ListItem button onClick={() => toggleExpandedIndex(1)}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Input Entry" />
    </ListItem>
    <Collapse in={expandedIndex === 1} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <Link to="billentry">
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Bill Entry" />
          </ListItemButton>
        </Link>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Collection Entry" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Payment Entry" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />
    <ListItem button onClick={() => toggleExpandedIndex(2)}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Report" />
    </ListItem>
    <Collapse in={expandedIndex === 2} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Supplier Ledger" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Buyer Ledger" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Transport Ledger" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />

    <ListItem button onClick={() => toggleExpandedIndex(3)}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Master" />
    </ListItem>
    <Collapse in={expandedIndex === 3} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Supplier Master" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Buyer Master" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Transport Master" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />
  </List>);
};