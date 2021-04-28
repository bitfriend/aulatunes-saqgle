import React, { Fragment, PureComponent } from 'react';
import './App.css';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Tab,
  TablePagination,
  Tabs,
  Toolbar,
  Typography,
  withStyles
} from '@material-ui/core';
import {
  Category,
  Close,
  Collections,
  Description,
  ExpandMore,
  LocalOffer,
  MusicNote,
  Person,
  Search,
  Today
} from '@material-ui/icons';
import moment from 'moment';

import { fetchData } from './api';
import AdvancedSearch from './AdvancedSearch';

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    margin: theme.spacing(2)
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.selected
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer'
    }
  },
  icon: {
    width: theme.spacing(6)
  }
});

class App extends PureComponent {
  state = {
    activeTab: 'topalbums',
    records: [],
    rowsPerPage: 5,
    page: 0,
    activeRow: -1,
    loading: false,
    open: false,
    name: '',
    artist: ''
  }

  componentDidMount() {
    this.fetchRecords();
  }

  fetchRecords() {
    const { activeTab, name, artist } = this.state;
    this.setState({ loading: true }, () => {
      fetchData(activeTab, name, artist).then(records => {
        this.setState({
          records,
          loading: false
        });
      }).catch(err => {
        console.log(activeTab, err.message);
        this.setState({ loading: false });
      });
    });
  }

  onChangeTab = (event, value) => {
    console.log(value);
    this.setState({
      activeTab: value,
      page: 0,
      records: [] // initialize records in according to activeTab
    }, () => {
      this.fetchRecords();
    });
  }

  onChangeRowsPerPage = (event) => this.setState({
    rowsPerPage: parseInt(event.target.value, 10),
    page: 0
  })

  onChangePage = (event, value) => this.setState({ page: value })

  onToggle = (index) => (event, expanded) => {
    if (expanded) {
      this.setState({ activeRow: index });
    } else {
      this.setState({ activeRow: -1 });
    }
  }

  onSubmit = ({ name, artist }) => this.setState({
    open: false,
    name,
    artist
  }, () => {
    this.fetchRecords();
  })

  onReset = () => this.setState({
    name: '',
    artist: ''
  }, () => {
    this.fetchRecords();
  })

  render = () => {
    const records = this.state.records.slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage);
    console.log(records);
    return (
      <div className={`App ${this.props.classes.root}`}>
        <AppBar>
          <Toolbar>
            <Tabs
              value={this.state.activeTab}
              onChange={this.onChangeTab}
              indicatorColor="secondary"
              textColor="inherit"
              centered
              style={{ flex: 1 }}
            >
              <Tab value="topalbums" label="Top Albums" />
              <Tab value="topsongs" label="Top Songs" />
            </Tabs>
            <IconButton onClick={() => this.setState({ open: true })}>
              <Search htmlColor="white" />
            </IconButton>
            {(!!this.state.name || !!this.state.artist) && (
              <IconButton onClick={this.onReset}>
                <Close htmlColor="white" />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Box pt={8}>
          {records.map((record, index) => (
            <Accordion
              key={index}
              expanded={this.state.activeRow === index}
              onChange={this.onToggle(index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
              >
                {this.state.activeRow === index ? (
                  <Typography>{this.state.activeTab === 'topalbums' ? record['im:name'].label + ` (${record['im:itemCount'].label})` : record['im:name'].label}</Typography>
                ) : (
                  <Fragment>
                    <Typography style={{ flex: 1 }}>{record['im:name'].label}</Typography>
                    <Typography style={{ flex: 1 }}>{record['im:artist'].label}</Typography>
                    <Typography style={{ flex: 1, textAlign: 'center' }}>{record['im:price'].label}</Typography>
                    <Typography style={{ flex: 1, textAlign: 'center' }}>{moment(record['im:releaseDate'].label).format('ll')}</Typography>
                  </Fragment>
                )}
              </AccordionSummary>
              <AccordionDetails>
                <Box mr={2}>
                  <Avatar alt="" src={record['im:image'][0].label} variant="rounded" />
                </Box>
                <Box style={{ flex: 1 }}>
                  <Box mb={1} display="flex">
                    <Category color="primary" className={this.props.classes.icon} />
                    <Typography>{record.category.attributes.label}</Typography>
                  </Box>
                  <Box mb={1} display="flex">
                    <MusicNote color="primary" className={this.props.classes.icon} />
                    <Typography>{record['im:contentType'].attributes.label}</Typography>
                  </Box>
                  <Box mb={1} display="flex">
                    <LocalOffer color="primary" className={this.props.classes.icon} />
                    <Typography>{record['im:price'].label}</Typography>
                  </Box>
                  <Box mb={1} display="flex">
                    <Today color="primary" className={this.props.classes.icon} />
                    <Typography>{moment(record['im:releaseDate'].label).format('ll')}</Typography>
                  </Box>
                </Box>
                <Box style={{ flex: 1 }}>
                  <Box mb={1} display="flex">
                    <Person color="primary" className={this.props.classes.icon} />
                    <Typography>{record['im:artist'].label}</Typography>
                  </Box>
                  {this.state.activeTab === 'topsongs' && (
                    <Box mb={1} display="flex">
                      <Collections color="primary" className={this.props.classes.icon} />
                      <Typography>{record['im:collection']['im:name'].label}</Typography>
                    </Box>
                  )}
                  <Box mb={1} display="flex">
                    <Description color="primary" className={this.props.classes.icon} />
                    <Typography>{record.rights.label}</Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={this.state.records.length}
            rowsPerPage={this.state.rowsPerPage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            page={this.state.page}
            onChangePage={this.onChangePage}
          />
        </Box>
        {this.state.loading && (
          <div className="spin-container">
            <CircularProgress />
          </div>
        )}
        <AdvancedSearch
          open={this.state.open}
          name={this.state.name}
          artist={this.state.artist}
          onClose={() => this.setState({ open: false })}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);
