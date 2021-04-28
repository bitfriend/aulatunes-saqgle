import React, { Fragment, PureComponent } from 'react';
import './App.css';

import HttpStatus from 'http-status-codes';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  CircularProgress,
  Paper,
  Tab,
  TablePagination,
  Tabs,
  Typography,
  withStyles
} from '@material-ui/core';
import {
  Category,
  Collections,
  Description,
  ExpandMore,
  LocalOffer,
  MusicNote,
  Person,
  Today
} from '@material-ui/icons';
import moment from 'moment';

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
    loading: false
  }

  componentDidMount() {
    this.fetchData(this.state.activeTab);
  }

  fetchData(activeTab) {
    this.setState({ loading: true }, () => {
      fetch(`https://itunes.apple.com/us/rss/${activeTab}/limit=100/json`).then(res => {
        if (res.ok) {
          res.json().then(json => {
            console.log(json);
            let records = [];
            if (json.feed && json.feed.entry) {
              records = json.feed.entry;
            }
            console.log(records[0]);
            this.setState({
              records,
              loading: false
            });
          }).catch(err => {
            console.log('JSON parse error', err.message);
            this.setState({ loading: false });
          });
        } else {
          const text = HttpStatus.getStatusText(res.status);
          throw new Error(text);
        }
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
      this.fetchData(value);
    });
  }

  onChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    });
  }

  onChangePage = (event, value) => {
    this.setState({ page: value });
  }

  onToggle = (index) => (event, expanded) => {
    if (expanded) {
      this.setState({ activeRow: index });
    } else {
      this.setState({ activeRow: -1 });
    }
  }

  render = () => {
    const records = this.state.records.slice(this.state.page * this.state.rowsPerPage, (this.state.page + 1) * this.state.rowsPerPage);
    return (
      <div className={`App ${this.props.classes.root}`}>
        <Paper>
          <Box pb={2}>
            <Tabs
              value={this.state.activeTab}
              onChange={this.onChangeTab}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab value="topalbums" label="Top Albums" />
              <Tab value="topsongs" label="Top Songs" />
            </Tabs>
          </Box>
        </Paper>
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
        {this.state.loading && (
          <div className="spin-container">
            <CircularProgress />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(App);
