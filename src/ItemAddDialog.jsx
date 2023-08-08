import React from 'react'

import { Dialog, DialogContent, IconButton, TextField, InputAdornment } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import ClearIcon from '@mui/icons-material/Clear'
import BackspaceIcon from '@mui/icons-material/Backspace'

export default class ItemAddDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            addCount: '',
        }
        this.add = this.add.bind(this)
    }

    add() {
        let radix = 10
        if (this.state.addCount.startsWith('0x')) {
            radix = 16
        }
        let number = parseInt(this.state.addCount, radix)
        if (isNaN(number) || number < 1) {
            return
        }
        this.props.onClose()
        this.props.onAddItem(this.props.id, number)
    }

    render() {
        return (
            <Dialog open={true} onClose={this.props.onClose}>
                <DialogContent className='flex-column' sx={{ padding: '0.5rem 0.25rem 0.5rem 0.25rem' }}>
                    <TextField
                        autoFocus
                        autoComplete='off'
                        size='small'
                        variant='outlined'
                        sx={{ width: '11rem' }}
                        value={this.state.addCount === null ? '' : this.state.addCount}
                        placeholder={this.props.type === 'count' ? 'count' : 'minutes'}
                        label={this.props.type === 'count' ? 'count' : 'minutes'}
                        onChange={(ev) => {
                            let val = ev.target.value
                            let radix = 10
                            if (val.startsWith('0x')) {
                                radix = 16
                            }
                            let test = parseInt(val, radix)
                            if (!isNaN(test) || val.length === 0 || radix === 16) {
                                this.setState({ addCount: val })
                            }
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                // Do code here
                                ev.preventDefault()
                                this.add()
                            }
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <IconButton size='small' onClick={() => this.setState({ addCount: '' })} disabled={this.state.addCount.length === 0}>
                                    <ClearIcon  />
                                </IconButton>
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="start">
                                <IconButton size='small' onClick={() => this.setState({ addCount: this.state.addCount.substring(0, this.state.addCount.length - 1) })} disabled={this.state.addCount.length === 0}>
                                    <BackspaceIcon />
                                </IconButton>

                            </InputAdornment>,
                            sx: {paddingLeft: '0.1rem', paddingRight: '0.1rem'},
                            readOnly: window.isMobile,
                        }}
                    />
                    <div className='flex-column centered'>
                        <div className='flex-row'>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '1' })}>
                                <img src='1.png' alt='1' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '2' })}>
                                <img src='2.png' alt='2' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '3' })}>
                                <img src='3.png' alt='3' className='button-number' />
                            </IconButton>
                        </div>
                        <div className='flex-row'>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '4' })}>
                                <img src='4.png' alt='4' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '5' })}>
                                <img src='5.png' alt='5' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '6' })}>
                                <img src='6.png' alt='6' className='button-number' />
                            </IconButton>
                        </div>
                        <div className='flex-row'>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '7' })}>
                                <img src='7.png' alt='7' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '8' })}>
                                <img src='8.png' alt='8' className='button-number' />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '9' })}>
                                <img src='9.png' alt='9' className='button-number' />
                            </IconButton>
                        </div>
                        <div className='flex-row'>
                            <IconButton onClick={this.props.onClose}>
                                <CloseIcon sx={{ width: '2.5rem' }} />
                            </IconButton>
                            <IconButton onClick={() => this.setState({ addCount: this.state.addCount + '0' })} disabled={this.state.addCount.length === 0}>
                                <img src='0.png' alt='0' className='button-number' />
                            </IconButton>
                            <IconButton disabled={this.state.addCount === '0' || this.state.addCount === ''} onClick={this.add}>
                                <DoneIcon sx={{ width: '2.5rem' }} />
                            </IconButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}