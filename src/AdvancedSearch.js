import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField
} from '@material-ui/core';
import {
  Person,
  Title
} from '@material-ui/icons';

class AdvancedSearch extends PureComponent {
  state = {
    name: '',
    artist: ''
  }

  onEnter = () => this.setState({
    name: this.props.name,
    artist: this.props.artist
  })

  onSubmit = () => this.props.onSubmit({
    name: this.state.name,
    artist: this.state.artist
  })

  render = () => (
    <Dialog
      open={this.props.open}
      onEnter={this.onEnter}
      onClose={this.props.onClose}
    >
      <DialogTitle>Advanced Search</DialogTitle>
      <DialogContent>
        <Box my={1}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Title color="primary" />
                </InputAdornment>
              )
            }}
            label="Name"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </Box>
        <Box my={1}>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              )
            }}
            label="Artist"
            value={this.state.artist}
            onChange={e => this.setState({ artist: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => this.props.onClose()}>Cancel</Button>
        <Button color="primary" onClick={this.onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}

AdvancedSearch.propTypes = {
  open: PropTypes.bool.isRequired,
  name: PropTypes.string,
  artist: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AdvancedSearch;
