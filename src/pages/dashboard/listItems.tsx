import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupIcon from '@mui/icons-material/Group';
import GroupsIcon from '@mui/icons-material/Groups';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

import { CurrencyRupee, Inventory, LocalShipping, PlaylistAddCheckCircle, StarBorder } from '@mui/icons-material';
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
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
        <ListItemButton sx={{ pl: 4 }} component={Link} to="billentry">
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Bill Entry" />
        </ListItemButton>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="billview">
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Bill View" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="collectionentry">
          <ListItemIcon>
            <PlaylistAddCheckCircle />
          </ListItemIcon>
          <ListItemText primary="Collection Entry" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemIcon>
            <CurrencyRupee />
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
            <Inventory />
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
            <LocalShipping />
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
        <ListItemButton sx={{ pl: 4 }} component={Link} to="suppliermaster">
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Supplier Master" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="buyermaster">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Buyer Master" />
        </ListItemButton>
      </List>
      <List component="div" disablePadding>
        <ListItemButton sx={{ pl: 4 }} component={Link} to="transportmaster">
          <ListItemIcon>
            <LocalShippingIcon />
          </ListItemIcon>
          <ListItemText primary="Transport Master" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />
  </List>);
};