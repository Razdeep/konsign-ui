import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SearchIcon from '@mui/icons-material/Search';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

import { CurrencyRupee, Inventory, LocalShipping, PlaylistAddCheckCircle } from '@mui/icons-material';
import { Collapse, Divider, List, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';

export default function MainListItems() {
  const [expandedIndex, setExpandedIndex] = React.useState<Number>(-1);
  const [selectedSubMenu, setSelectedSubMenu] = React.useState<Number>(-1);

  const toggleExpandedIndex = (index: Number) => {
    setSelectedSubMenu(-1)
    setExpandedIndex(expandedIndex === index ? -1 : index)
  }

  const getListItemSx = (active: boolean) => ({
    pl: 4,
    ...(active && {
      bgcolor: "primary.main",
      color: "white",
    }),
  });

  return (<List>
    <ListItem button onClick={() => toggleExpandedIndex(1)}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Input Entry" />
    </ListItem>
    <Collapse in={expandedIndex === 1} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 1)} component={Link} to="billentry" 
        onClick={() => setSelectedSubMenu(1)}>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Bill Entry" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 2)} component={Link} to="collectionentry"
        onClick={() => setSelectedSubMenu(2)}>
          <ListItemIcon>
            <PlaylistAddCheckCircle />
          </ListItemIcon>
          <ListItemText primary="Collection Entry" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 3)} disabled
        onClick={() => setSelectedSubMenu(3)}>
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
        <SearchIcon />
      </ListItemIcon>
      <ListItemText primary="View Entry" />
    </ListItem>
    <Collapse in={expandedIndex === 2} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 1)} component={Link} to="billview" onClick={() => setSelectedSubMenu(1)}>
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Bill View" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 2)} component={Link} to="collectionview" onClick={() => setSelectedSubMenu(2)} disabled>
          <ListItemIcon>
            <PlaylistAddCheckCircle />
          </ListItemIcon>
          <ListItemText primary="Collection View" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 3)} component={Link} to="paymentview" onClick={() => setSelectedSubMenu(3)} disabled>
          <ListItemIcon>
            <CurrencyRupee />
          </ListItemIcon>
          <ListItemText primary="Payment View" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />
    <ListItem button onClick={() => toggleExpandedIndex(3)}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Report" />
    </ListItem>
    <Collapse in={expandedIndex === 3} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 1)} onClick={() => setSelectedSubMenu(1)} disabled>
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Supplier Ledger" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 2)} onClick={() => setSelectedSubMenu(2)} component={Link} to="buyerledger">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Buyer Ledger" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 3)} onClick={() => setSelectedSubMenu(3)} disabled>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Transport Ledger" />
        </ListItemButton>
      </List>
    </Collapse>
    <Divider />

    <ListItem button onClick={() => toggleExpandedIndex(4)}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Master" />
    </ListItem>
    <Collapse in={expandedIndex === 4} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 1)} onClick={() => setSelectedSubMenu(1)} component={Link} to="suppliermaster">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Supplier Master" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 2)} onClick={() => setSelectedSubMenu(2)} component={Link} to="buyermaster">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Buyer Master" />
        </ListItemButton>
        <ListItemButton sx={getListItemSx(selectedSubMenu === 3)} onClick={() => setSelectedSubMenu(3)} component={Link} to="transportmaster">
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